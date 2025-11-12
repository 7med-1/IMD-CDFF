"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:8000/api/pieces';
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔍 Fetching page 1...');
        const res1 = yield axios_1.default.get(`${API_URL}?page=1&limit=20`);
        console.log('Total:', res1.data.pagination.total);
        console.log('Items on page 1:', res1.data.data.length);
        console.log('\n🔍 Searching for "Brake"...');
        const res2 = yield axios_1.default.get(`${API_URL}?search=Brake&page=1&limit=20`);
        console.log('Search results:', res2.data.data);
    }
    catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}))();
