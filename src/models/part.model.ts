import mongoose, { Document, Schema } from 'mongoose';
import { PartBase, PartType, ConstituentPart } from '../types/part';

// Extend Document with our PartBase interface (no id conflict)
export interface PartDocument extends PartBase, Document {}

const ConstituentPartSchema = new Schema<ConstituentPart>({
  id: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const PartSchema = new Schema<PartDocument>({
  _id: {
    type: String,
    required: true,
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    index: true 
  },
  type: { 
    type: String, 
    enum: Object.values(PartType), 
    required: true,
    index: true 
  },
  quantityInStock: { 
    type: Number, 
    required: true, 
    default: 0, 
    min: 0 
  },
  parts: {
    type: [ConstituentPartSchema],
    default: undefined,
    validate: {
      validator: function(this: PartDocument, parts: ConstituentPart[]) {
        if (this.type === PartType.RAW) {
          return !parts || parts.length === 0;
        }
        return parts && parts.length > 0;
      },
      message: 'RAW parts should not have constituent parts, ASSEMBLED parts must have constituent parts'
    }
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

// Compound index for efficient queries
PartSchema.index({ type: 1, name: 1 });

export const PartModel = mongoose.model<PartDocument>('Part', PartSchema);
