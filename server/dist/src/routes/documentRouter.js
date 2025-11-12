"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentController_1 = require("../controllers/documentController"); // Adjust path to controller
const router = express_1.default.Router();
/**
 * Route: GET /api/documents?ref=F-001&type=facture
 * Fetches one Facture or Devis record with all nested data.
 */
router.get('/documents', documentController_1.getDocument);
exports.default = router;
