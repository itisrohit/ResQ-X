import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js';
import session from 'express-session';

const app = express();
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));



//Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('This Api is working');
});


//routes import
import userRouter from './routes/user.routes.js';


//routes declaration
app.use('/api/v1/users', userRouter);



export { app };