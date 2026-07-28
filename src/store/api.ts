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

export interface ProductPrice {
  symbol: string;
  value: number;
  isDefault: boolean;
}

export interface ProductListItem {
  id: number;
  title: string;
  type: string;
  serialNumber: string | null;
  isNew: boolean;
  photo: string | null;
  specification: string | null;
  guaranteeStart: string | null;
  guaranteeEnd: string | null;
  orderTitle: string;
  prices: ProductPrice[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Order', 'Product'],
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
      /**
       * Deleting an order cascades to delete all of its products in the DB,
       * so the Products list/cache must be invalidated too.
       */
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    getProducts: builder.query<ProductListItem[], string | undefined>({
      query: (type) => (type ? `/products?type=${encodeURIComponent(type)}` : '/products'),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      /**
       * A product's parent order's productsCount/totals change too, so the
       * Orders list/cache must be invalidated alongside the Products one.
       */
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useDeleteOrderMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
} = api;
