import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import './config/passport.js';

// Load environment variables
dotenv.config();

// Initialize Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*', 
    // methods: ['GET', 'POST'],
  },
});


// Middleware Configuration
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Session Configuration (Required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Socket.io Authentication & Event Handling
const configureSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.role} - ${socket.user._id}`);

    // Join role-specific room
    socket.join(socket.user.role);
    
    // Join user-specific room for direct messaging
    socket.join(socket.user._id.toString());

    // Volunteer joins location-based room
    if (socket.user.role === 'volunteer') {
      const [lng, lat] = socket.user.location.coordinates;
      socket.join(`geo:${lng.toFixed(2)},${lat.toFixed(2)}`);
    }

    // Handle SOS lifecycle events
    socket.on('accept-sos', async (sosId) => {
      try {
        const sos = await SOSRequest.findByIdAndUpdate(
          sosId,
          { volunteer: socket.user._id, status: 'accepted' },
          { new: true }
        ).populate('victim');

        // Notify victim
        io.to(sos.victim._id.toString()).emit('sos-updated', sos);
        
        // Notify NGOs
        io.to('ngo').emit('sos-status-changed', sos);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.role} - ${socket.user._id}`);
      if (socket.user.role === 'volunteer') {
        io.to('ngo').emit('volunteer-offline', socket.user._id);
      }
    });
  });
};

configureSocket(io);

// Attach Socket.io to app context
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route Configuration
import ngoRoutes from './routes/ngoRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import victimRoutes from './routes/victimRoutes.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import userRouter from './routes/user.routes.js';

// API routes
app.use('/api/ngo', ngoRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/victim', victimRoutes);
app.use('/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/v1/users', userRouter);

// Public Route (Health Check)
app.get('/', (req, res) => {
  res.send('This API is working');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export { app };
