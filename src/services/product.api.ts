import apiClient from "./apiClient";

export const productApi = {
    getAll: async () => {
        const response = await apiClient.get('/api/admin-products');
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


