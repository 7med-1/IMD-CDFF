import axios from 'axios';

const API_URL = 'http://localhost:8000/api/pieces';

(async () => {
  try {

    await axios.get(`${API_URL}?search=Brake`);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Test failed:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('❌ Test failed:', error.message);
    } else {
      console.error('❌ Test failed: Unknown error', error);
    }
  }
})();
