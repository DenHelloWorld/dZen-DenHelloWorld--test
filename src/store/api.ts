import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
}

export interface CurrencyTotal {
  symbol: string;
  value: number;
}

export interface OrderListItem {
  id: number;
  title: string;
  productsCount: number;
  createdAt: string;
  totals: CurrencyTotal[];
}

export interface OrderProductPrice {
  symbol: string;
  value: number;
  isDefault: boolean;
}

export interface OrderProduct {
  id: number;
  title: string;
  type: string;
  serialNumber: string | null;
  isNew: boolean;
  photo: string | null;
  specification: string | null;
  guaranteeStart: string | null;
  guaranteeEnd: string | null;
  prices: OrderProductPrice[];
}

export interface OrderDetail {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  totals: CurrencyTotal[];
  products: OrderProduct[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getOrders: builder.query<OrderListItem[], void>({
      query: () => '/orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order' as const, id: 'LIST' },
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),

    getOrder: builder.query<OrderDetail, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    deleteOrder: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const { useLoginMutation, useGetOrdersQuery, useGetOrderQuery, useDeleteOrderMutation } =
  api;
