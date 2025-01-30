import mongoose, { Schema } from 'mongoose';

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
        },
        coordinates: {
          type: [Number],
        }
      },
      isOnDuty: {
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
