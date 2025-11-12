import axios from 'axios';




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




async function runTests() {
try {
console.log('🧹 Clearing old test pieces (if any)...');
const all = await axios.get(API_URL);
for (const p of all.data) {
if (p.reference.includes('-')) {
await axios.delete(`${API_URL}/${p.pieceId}`);
}
}

console.log('🛠 Creating 10 Caterpillar pieces...');
const created = [];
for (const piece of testPieces) {
  const res = await axios.post(API_URL, piece);
  console.log(`✅ Created: ${piece.reference}`);
  created.push(res.data);
}

console.log('\n🔍 Testing search by "8H"...');
const searchRes = await axios.get(`${API_URL}?search=8H`);
console.log('Found results:', searchRes.data.map((p: any) => p.reference));

console.log('\n📋 Verifying total pieces count...');
const finalList = await axios.get(API_URL);
console.log(`✅ Total pieces in DB now: ${finalList.data.length}`);

console.log('\n✅ All tests completed successfully!');




} catch (error: any) {
console.error('❌ Test failed:', error.response?.data || error.message);
}
}




runTests();