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
// testBackend.ts
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const BASE_URL = 'http://localhost:8000/pieces';
function testBackend() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log('1️⃣ Creating a new piece...');
            const form = new form_data_1.default();
            form.append('name', 'Test Piece');
            form.append('reference', 'REF-TEST-001');
            form.append('place', 'Warehouse 1');
            form.append('description', 'A test piece');
            form.append('quantity', '10');
            form.append('price', '99.99');
            form.append('file', fs_1.default.createReadStream(path_1.default.join(__dirname, 'test-image.jpg')));
            const createRes = yield axios_1.default.post(BASE_URL, form, {
                headers: form.getHeaders(),
            });
            const piece = createRes.data;
            console.log('Created piece:', piece);
            console.log('2️⃣ Listing all pieces...');
            const listRes = yield axios_1.default.get(BASE_URL);
            console.log('All pieces:', listRes.data);
            console.log('3️⃣ Updating the piece...');
            const updateRes = yield axios_1.default.put(`${BASE_URL}/${piece.pieceId}`, {
                name: 'Updated Test Piece',
                reference: 'REF-TEST-001',
                place: 'Shelf 2',
                description: 'Updated description',
                quantity: 20,
                price: 109.99,
            });
            console.log('Updated piece:', updateRes.data);
            console.log('4️⃣ Taking 5 quantity...');
            const takeRes = yield axios_1.default.patch(`${BASE_URL}/${piece.pieceId}/take`, {
                amount: 5,
            });
            console.log('After taking quantity:', takeRes.data);
            console.log('5️⃣ Adding 10 quantity...');
            const addRes = yield axios_1.default.patch(`${BASE_URL}/${piece.pieceId}/add`, {
                amount: 10,
            });
            console.log('After adding quantity:', addRes.data);
            console.log('6️⃣ Deleting the piece...');
            const deleteRes = yield axios_1.default.delete(`${BASE_URL}/${piece.pieceId}`);
            console.log('Deleted piece:', deleteRes.data);
            console.log('✅ All tests completed successfully!');
        }
        catch (error) {
            console.error('❌ Test failed:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
testBackend();
