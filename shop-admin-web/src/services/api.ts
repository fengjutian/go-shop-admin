import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 店铺相关 API
export const shopApi = {
  // 获取店铺列表
  getShops: async (page = 1, pageSize = 10) => {
    const response = await api.get('/shops', {
      params: {
        page,
        pageSize
      }
    });
    return response.data;
  },

  // 获取店铺详情
  getShop: async (id: number) => {
    const response = await api.get(`/shops/${id}`);
    return response.data;
  },

  // 创建店铺
  createShop: async (shop: any) => {
    const response = await api.post('/shops', shop);
    return response.data;
  },

  // 更新店铺
  updateShop: async (id: number, shop: any) => {
    const response = await api.put(`/shops/${id}`, shop);
    return response.data;
  },

  // 删除店铺
  deleteShop: async (id: number) => {
    const response = await api.delete(`/shops/${id}`);
    return response.data;
  },
};

// 类型相关 API
export const typeApi = {
  // 获取类型列表
  getTypes: async (page = 1, pageSize = 10) => {
    const response = await api.get('/types', {
      params: {
        page,
        pageSize
      }
    });
    return response.data;
  },

  // 获取类型详情
  getType: async (id: number) => {
    const response = await api.get(`/types/${id}`);
    return response.data;
  },

  // 创建类型
  createType: async (type: any) => {
    const response = await api.post('/types', type);
    return response.data;
  },

  // 更新类型
  updateType: async (id: number, type: any) => {
    const response = await api.put(`/types/${id}`, type);
    return response.data;
  },

  // 删除类型
  deleteType: async (id: number) => {
    const response = await api.delete(`/types/${id}`);
    return response.data;
  },
};

export default api;