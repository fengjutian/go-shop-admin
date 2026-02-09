import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 店铺相关 API
export const shopApi = {
  // 获取店铺列表
  getShops: async () => {
    const response = await api.get('/shops');
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

export default api;