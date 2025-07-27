import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IScheme, {}, {}, {}, mongoose.Document<unknown, {}, IScheme> & IScheme & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=scheme.d.ts.map