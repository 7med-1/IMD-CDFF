/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from '@/app/redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken } from '.';

// --- Interfaces ---
export interface Piece {
  pieceId: string;
  name: string;
  reference: string;
  place: string;
  description?: string;
  quantity: number;
  price: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewPiece {
  name: string;
  reference: string;
  place: string;
  description?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface PaginatedPieces {
  data: Piece[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).global.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithLogout = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Token expired or invalid → auto logout
    localStorage.removeItem('token');
    api.dispatch(setToken(null));
    window.location.href = '/login';
  }

  return result;
};

// --- API Slice ---
export const piecesApi = createApi({
   reducerPath: 'piecesApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['Pieces'],
  endpoints: (build) => ({
    login: build.mutation<
      { message: string; token: string },
      { name: string; password: string }
    >({
      query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
    }),
    getPieces: build.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/api/pieces',
        params: { page, limit },
      }),
      providesTags: ['Pieces'],
    }),

    createPiece: build.mutation<Piece, FormData>({
      query: (formData) => ({
        url: '/api/pieces',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Pieces'],
    }),

    updatePiece: build.mutation<Piece, { pieceId: string; formData: FormData }>(
      {
        query: ({ pieceId, formData }) => ({
          url: `/api/pieces/${pieceId}`,
          method: 'PUT',
          body: formData,
        }),
      }
    ),

    deletePiece: build.mutation<{ message: string }, string>({
      query: (pieceId) => ({
        url: `/api/pieces/${pieceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pieces'],
    }),

    takePiece: build.mutation<Piece, { pieceId: string; amount: number }>({
      query: ({ pieceId, amount }) => ({
        url: `/api/pieces/${pieceId}/take`,
        method: 'PATCH',
        body: { amount },
      }),
      invalidatesTags: ['Pieces'],
    }),

    addPieceQuantity: build.mutation<
      Piece,
      { pieceId: string; amount: number }
    >({
      query: ({ pieceId, amount }) => ({
        url: `/api/pieces/${pieceId}/add`,
        method: 'PATCH',
        body: { amount },
      }),
      invalidatesTags: ['Pieces'],
    }),
  }),
});

// --- Hooks ---
export const {
  useGetPiecesQuery,
  useCreatePieceMutation,
  useUpdatePieceMutation,
  useDeletePieceMutation,
  useTakePieceMutation,
  useAddPieceQuantityMutation,
  useLoginMutation,
} = piecesApi;
