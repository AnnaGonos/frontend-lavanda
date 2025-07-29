import apiClient from "./apiClient";
import {Product} from "../types/product.types";


export interface PaginatedProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}



export const productApi = {
    getAll: async (page: number = 1, limit: number = 20, filter?: 'active' | 'archived' | 'all') => {
        const params: any = { page, limit };
        if (filter && filter !== 'all') {
            params.filter = filter;
        }

        const response = await apiClient.get<PaginatedProductsResponse>('/api/admin-products', { params });
        return response.data;
    },

    add: async (formData: FormData) => {
        const response = await apiClient.post('/api/admin-products/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await apiClient.put(`/api/admin-products/${id}`, data);
        return response.data;
    },
    archive: async (id: number) => {
        const response = await apiClient.put(`/api/admin-products/${id}/archive`);
        return response.data;
    },
    remove: async (id: number) => {
        const response = await apiClient.delete(`/api/admin-products/${id}`);
        return response.data;
    },
};



