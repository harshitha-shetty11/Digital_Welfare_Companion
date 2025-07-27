"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemeController_1 = require("../controllers/schemeController");
const router = (0, express_1.Router)();
router.get('/', schemeController_1.getAllSchemesHandler);
router.get('/search', schemeController_1.searchSchemesHandler);
router.get('/:id', schemeController_1.getSchemeByIdHandler);
exports.default = router;
//# sourceMappingURL=schemes.js.map