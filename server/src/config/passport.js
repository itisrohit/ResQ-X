import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {User} from '../models/user.model.js';

// Google Strategy
passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log('profile: ', profile);
        // console.log('accessToken: ', accessToken);
        // console.log('refreshToken: ', refreshToken);
        
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                email: profile.emails[0].value,  
                fullname: profile.displayName,  
                googleId: profile.id,                               
            });
            await user.save();
        }
        done(null, user, { accessToken, refreshToken });
    } catch (error) {
        done(error, null);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});