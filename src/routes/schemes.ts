import { Router } from 'express';
import { getAllSchemesHandler, getSchemeByIdHandler, searchSchemesHandler } from '../controllers/schemeController';

const router = Router();

// GET /api/schemes - Get all schemes or search schemes
router.get('/', getAllSchemesHandler);

// GET /api/schemes/search - Search schemes (alternative endpoint)
router.get('/search', searchSchemesHandler);

// GET /api/schemes/:id - Get a specific scheme by ID
router.get('/:id', getSchemeByIdHandler);

export default router;
