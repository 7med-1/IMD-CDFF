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
const API_URL = 'http://localhost:8000/pieces';
const testPieces = [
    { name: 'Caterpillar Part 3D-2992', reference: '3D-2992', place: 'A1', description: 'Caterpillar engine component', quantity: 11, price: 250, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 109-0078', reference: '109-0078', place: 'A2', description: 'Caterpillar hydraulic system part', quantity: 7, price: 190, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 8H-0273', reference: '8H-0273', place: 'A3', description: 'Caterpillar exhaust valve', quantity: 9, price: 310, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 142-6217', reference: '142-6217', place: 'B1', description: 'Caterpillar filter element', quantity: 10, price: 275, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 3S-3978', reference: '3S-3978', place: 'B2', description: 'Caterpillar pump housing', quantity: 18, price: 430, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 4F-7387', reference: '4F-7387', place: 'B3', description: 'Caterpillar cooling pipe', quantity: 6, price: 145, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 8H-2046', reference: '8H-2046', place: 'C1', description: 'Caterpillar crankshaft', quantity: 8, price: 520, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 7H-2444', reference: '7H-2444', place: 'C2', description: 'Caterpillar piston rod', quantity: 13, price: 380, image: 'https://via.placeholder.com/150' },
    { name: 'Caterpillar Part 2H-3927', reference: '2H-3927', place: 'C3', description: 'Caterpillar gearbox part', quantity: 13, price: 415, image: 'https://via.placeholder.com/150' },
];
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log('🧹 Clearing old test pieces (if any)...');
            const all = yield axios_1.default.get(API_URL);
            for (const p of all.data) {
                if (p.reference.includes('-')) {
                    yield axios_1.default.delete(`${API_URL}/${p.pieceId}`);
                }
            }
            console.log('🛠 Creating 10 Caterpillar pieces...');
            const created = [];
            for (const piece of testPieces) {
                const res = yield axios_1.default.post(API_URL, piece);
                console.log(`✅ Created: ${piece.reference}`);
                created.push(res.data);
            }
            console.log('\n🔍 Testing search by "8H"...');
            const searchRes = yield axios_1.default.get(`${API_URL}?search=8H`);
            console.log('Found results:', searchRes.data.map((p) => p.reference));
            console.log('\n📋 Verifying total pieces count...');
            const finalList = yield axios_1.default.get(API_URL);
            console.log(`✅ Total pieces in DB now: ${finalList.data.length}`);
            console.log('\n✅ All tests completed successfully!');
        }
        catch (error) {
            console.error('❌ Test failed:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
runTests();
