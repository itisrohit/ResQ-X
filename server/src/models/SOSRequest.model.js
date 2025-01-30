import mongoose, { Schema } from 'mongoose';
const sosRequestSchema = new Schema({
    victim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      category: {
        type: String,
        enum: ['medical', 'food', 'shelter', 'rescue', 'other'],
        required: true
      },
      description: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'resolved', 'cancelled'],
        default: 'pending'
      },
      volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      resolvedAt: Date
}, {
    timestamps: true
});

sosRequestSchema.index({ location: '2dsphere' });
sosRequestSchema.index({ status: 1 });

export const SOSRequest = mongoose.model('SOSRequest', sosRequestSchema);
