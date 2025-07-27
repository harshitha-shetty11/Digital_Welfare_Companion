import mongoose, { Schema, Document } from 'mongoose';

export interface IScheme extends Document {
  name: string;
  description: string;
  category: string;
  eligibility: Record<string, any>;
  documents: string[];
  applicationProcess: string;
  benefitAmount?: string;
  state?: string;
  isActive: boolean;
}

const SchemeSchema = new Schema<IScheme>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  eligibility: { type: Schema.Types.Mixed, required: true },
  documents: [String],
  applicationProcess: { type: String, required: true },
  benefitAmount: String,
  state: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

SchemeSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model<IScheme>('Scheme', SchemeSchema);
