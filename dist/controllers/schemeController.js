"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchemesHandler = exports.getSchemeByIdHandler = exports.getAllSchemesHandler = void 0;
const databaseService_1 = require("../services/databaseService");
const scheme_1 = __importDefault(require("../models/scheme"));
const getAllSchemesHandler = async (req, res) => {
    try {
        const { query, category, state } = req.query;
        let schemes;
        if (query || category || state) {
            schemes = await (0, databaseService_1.searchSchemes)(query || '', { category, state });
        }
        else {
            schemes = await (0, databaseService_1.getAllSchemes)();
        }
        res.json({
            success: true,
            data: schemes,
            count: schemes.length
        });
    }
    catch (error) {
        console.error('Get All Schemes Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve schemes'
        });
    }
};
exports.getAllSchemesHandler = getAllSchemesHandler;
const getSchemeByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Scheme ID is required'
            });
            return;
        }
        const scheme = await scheme_1.default.findById(id);
        if (!scheme) {
            res.status(404).json({
                success: false,
                error: 'Scheme not found'
            });
            return;
        }
        res.json({
            success: true,
            data: scheme
        });
    }
    catch (error) {
        console.error('Get Scheme By ID Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve scheme'
        });
    }
};
exports.getSchemeByIdHandler = getSchemeByIdHandler;
const searchSchemesHandler = async (req, res) => {
    try {
        const { query, category, state } = req.query;
        if (!query && !category && !state) {
            res.status(400).json({
                success: false,
                error: 'At least one search parameter (query, category, or state) is required'
            });
            return;
        }
        const schemes = await (0, databaseService_1.searchSchemes)(query || '', { category, state });
        res.json({
            success: true,
            data: schemes,
            count: schemes.length,
            searchParams: { query, category, state }
        });
    }
    catch (error) {
        console.error('Search Schemes Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search schemes'
        });
    }
};
exports.searchSchemesHandler = searchSchemesHandler;
//# sourceMappingURL=schemeController.js.map