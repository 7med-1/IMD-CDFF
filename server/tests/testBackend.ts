// testBackend.ts
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:8000/pieces';

async function testBackend() {
  try {
    console.log('1️⃣ Creating a new piece...');

    const form = new FormData();
    form.append('name', 'Test Piece');
    form.append('reference', 'REF-TEST-001');
    form.append('place', 'Warehouse 1');
    form.append('description', 'A test piece');
    form.append('quantity', '10');
    form.append('price', '99.99');
    form.append('file', fs.createReadStream(path.join(__dirname, 'test-image.jpg')));

    const createRes = await axios.post(BASE_URL, form, {
      headers: form.getHeaders(),
    });

    const piece = createRes.data;
    console.log('Created piece:', piece);

    console.log('2️⃣ Listing all pieces...');
    const listRes = await axios.get(BASE_URL);
    console.log('All pieces:', listRes.data);

    console.log('3️⃣ Updating the piece...');
    const updateRes = await axios.put(`${BASE_URL}/${piece.pieceId}`, {
      name: 'Updated Test Piece',
      reference: 'REF-TEST-001',
      place: 'Shelf 2',
      description: 'Updated description',
      quantity: 20,
      price: 109.99,
    });
    console.log('Updated piece:', updateRes.data);

    console.log('4️⃣ Taking 5 quantity...');
    const takeRes = await axios.patch(`${BASE_URL}/${piece.pieceId}/take`, {
      amount: 5,
    });
    console.log('After taking quantity:', takeRes.data);

    console.log('5️⃣ Adding 10 quantity...');
    const addRes = await axios.patch(`${BASE_URL}/${piece.pieceId}/add`, {
      amount: 10,
    });
    console.log('After adding quantity:', addRes.data);

    console.log('6️⃣ Deleting the piece...');
    const deleteRes = await axios.delete(`${BASE_URL}/${piece.pieceId}`);
    console.log('Deleted piece:', deleteRes.data);

    console.log('✅ All tests completed successfully!');
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBackend();
