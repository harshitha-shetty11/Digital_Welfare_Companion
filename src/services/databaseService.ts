import Scheme from '../models/scheme';

export const getAllSchemes = async () => {
  try {
    return await Scheme.find({ isActive: true });
  } catch (error) {
    console.error('MongoDB error:', error);
    return [];
  }
};

export const getSchemesByIds = async (ids: string[], language: string = 'en') => {
  try {
    const schemes = await Scheme.find({ _id: { $in: ids } });
    // (Optional) Localize name/description if you keep multilingual fields on model
    return schemes;
  } catch (error) {
    console.error('MongoDB error:', error);
    return [];
  }
};

export const searchSchemes = async (query: string, filters: any = {}) => {
  try {
    // Text search on name/description/category
    const schemes = await Scheme.find({ 
      $text: { $search: query }, 
      isActive: true,
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.state ? { $or: [{ state: filters.state }, { state: null }] } : {})
    }).limit(10);
    return schemes;
  } catch (error) {
    console.error('MongoDB error:', error);
    return [];
  }
};

// Optional: Insert sample data
export const initializeSampleData = async () => {
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
      // Using upsert behavior to avoid duplicates on repeated runs
      await Scheme.updateOne({ name: scheme.name }, scheme, { upsert: true });
    }

    console.log('✅ Sample data initialized');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};
