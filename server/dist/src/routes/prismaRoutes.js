"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = require("../controllers/prismaClient");
const router = (0, express_1.Router)();
router.get('/', prismaClient_1.getPiecess);
exports.default = router;
