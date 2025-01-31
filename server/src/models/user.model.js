import mongoose, { Schema } from 'mongoose';
import { validateCoordinates } from '../utils/geospatial.js';

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    googleId: {
        type: String,
    },
    role: {
        type: String,
        enum: ['ngo', 'volunteer', 'victim'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: validateCoordinates,
                message: 'Invalid coordinates: must be [longitude, latitude] within valid range'
            }
        }
    },
    isOnDuty: {
        type: Boolean,
        default: false
    },
    isBusy: {
      type: Boolean,
      default: false
    },
    phone: {
        type: String,
    },
}, {
    timestamps: true
});

userSchema.index({ location: '2dsphere' });

export const User = mongoose.model('User', userSchema);