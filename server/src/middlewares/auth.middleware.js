import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        // Attempt to verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const decodedToken = ticket.getPayload();

        // Find the user in the database
        const user = await User.findById(decodedToken?.sub || decodedToken?._id || decodedToken?.id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'Invalid Access Token' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
};

export default authMiddleware;