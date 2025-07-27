import { Request, Response } from 'express';
import { getAllSchemes, searchSchemes } from '../services/databaseService';
import Scheme from '../models/scheme';

export const getAllSchemesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, category, state } = req.query;

    let schemes;
    if (query || category || state) {
      schemes = await searchSchemes(query as string || '', { category, state });
    } else {
      schemes = await getAllSchemes();
    }

    res.json({
      success: true,
      data: schemes,
      count: schemes.length
    });

  } catch (error) {
    console.error('Get All Schemes Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve schemes'
    });
  }
};

export const getSchemeByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Scheme ID is required'
      });
      return;
    }

    const scheme = await Scheme.findById(id);

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

  } catch (error) {
    console.error('Get Scheme By ID Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve scheme'
    });
  }
};

export const searchSchemesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, category, state } = req.query;

    if (!query && !category && !state) {
      res.status(400).json({
        success: false,
        error: 'At least one search parameter (query, category, or state) is required'
      });
      return;
    }

    const schemes = await searchSchemes(query as string || '', { category, state });

    res.json({
      success: true,
      data: schemes,
      count: schemes.length,
      searchParams: { query, category, state }
    });

  } catch (error) {
    console.error('Search Schemes Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search schemes'
    });
  }
};
