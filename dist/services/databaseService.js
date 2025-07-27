"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSampleData = exports.searchSchemes = exports.getSchemesByIds = exports.getAllSchemes = void 0;
const scheme_1 = __importDefault(require("../models/scheme"));
const getAllSchemes = async () => {
    try {
        return await scheme_1.default.find({ isActive: true });
    }
    catch (error) {
        console.error('MongoDB error:', error);
        return [];
    }
};
exports.getAllSchemes = getAllSchemes;
const getSchemesByIds = async (ids, language = 'en') => {
    try {
        const schemes = await scheme_1.default.find({ _id: { $in: ids } });
        return schemes;
    }
    catch (error) {
        console.error('MongoDB error:', error);
        return [];
    }
};
exports.getSchemesByIds = getSchemesByIds;
const searchSchemes = async (query, filters = {}) => {
    try {
        const schemes = await scheme_1.default.find({
            $text: { $search: query },
            isActive: true,
            ...(filters.category ? { category: filters.category } : {}),
            ...(filters.state ? { $or: [{ state: filters.state }, { state: null }] } : {})
        }).limit(10);
        return schemes;
    }
    catch (error) {
        console.error('MongoDB error:', error);
        return [];
    }
};
exports.searchSchemes = searchSchemes;
const initializeSampleData = async () => {
    try {
        const sampleSchemes = [
            {
                name: 'PM-KISAN Samman Nidhi',
                description: 'Financial assistance to small and marginal farmers',
                category: 'agriculture',
                eligibility: {
                    landHolding: 'up to 2 hectares',
                    farmer: true,
                    citizenship: 'Indian'
                },
                documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records'],
                applicationProcess: 'Apply online at pmkisan.gov.in or visit nearest Common Service Center',
                benefitAmount: '₹6,000 per year',
                applicationUrl: 'https://pmkisan.gov.in',
                isActive: true
            },
            {
                name: 'Pradhan Mantri Awas Yojana',
                description: 'Housing scheme for economically weaker sections',
                category: 'housing',
                eligibility: {
                    income: 'below 18 lakh annually',
                    firstTimeHomeBuyer: true,
                    citizenship: 'Indian'
                },
                documents: ['Aadhaar Card', 'Income Certificate', 'Bank Statements'],
                applicationProcess: 'Apply through authorized banks or online portal',
                benefitAmount: 'Subsidy up to ₹2.67 lakh',
                applicationUrl: 'https://pmaymis.gov.in',
                isActive: true
            }
        ];
        for (const scheme of sampleSchemes) {
            await scheme_1.default.updateOne({ name: scheme.name }, scheme, { upsert: true });
        }
        console.log('✅ Sample data initialized');
    }
    catch (error) {
        console.error('Error initializing sample data:', error);
    }
};
exports.initializeSampleData = initializeSampleData;
//# sourceMappingURL=databaseService.js.map