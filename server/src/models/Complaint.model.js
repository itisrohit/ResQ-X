import mongoose, { Schema } from 'mongoose';
const complaintSchema = new Schema({
    filedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      description: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open'
      },
      category: {
        type: String,
        enum: ['medical', 'food', 'shelter', 'rescue', 'other'],
        required: true
      },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
}, {timestamps: true});