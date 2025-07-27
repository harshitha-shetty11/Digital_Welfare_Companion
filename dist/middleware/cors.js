"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsErrorHandler = exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
];
exports.corsMiddleware = (0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
const corsErrorHandler = (err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({
            success: false,
            error: 'CORS policy violation',
            message: 'Origin not allowed'
        });
    }
    else {
        next(err);
    }
};
exports.corsErrorHandler = corsErrorHandler;
//# sourceMappingURL=cors.js.map