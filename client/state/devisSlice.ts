import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Devis } from '@/types/devis';

interface DevisState {
  currentDevis: Devis | null;
}

const initialState: DevisState = {
  currentDevis: null,
};

const devisSlice = createSlice({
  name: 'devis',
  initialState,
  reducers: {
    setDevis: (state, action: PayloadAction<Devis>) => {
      state.currentDevis = action.payload;
    },
  },
});

export const { setDevis } = devisSlice.actions;
export default devisSlice.reducer;
