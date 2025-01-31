import 'dotenv/config';
import connectDB from './config/db.js';
import { app } from './app.js';
import http from 'http';
const server = http.createServer(app);



connectDB()
.then(() => {
    server.listen(process.env.PORT || 8080, () => {
        console.log(`Server is running on port ${process.env.PORT|| 8080}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed !!!", error);
});