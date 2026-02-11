import React, { useState, useEffect } from 'react';
import { shopApi } from '../services/api';

type TypeList = 'retail' | 'restaurant' | 'service' | 'other';

interface Shop {
  id?: string | number;
  name: string;
  email: string;
  address?: string;
  type?: TypeList;
  contact?: string;
  rating?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  otherInfo?: string | null;
  imageBase64?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

const Shops: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<Shop>({
    name: '',
    email: '',
    address: '',
    type: 'retail',
    contact: '',
    rating: null,
    latitude: null,
    longitude: null,
    otherInfo: null,
    imageBase64: null,
    description: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 获取店铺列表
  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const shopsData = await shopApi.getShops(currentPage, pageSize);
      setShops(shopsData.data);
      setTotalItems(shopsData.total || shopsData.data.length);
      setTotalPages(Math.ceil((shopsData.total || shopsData.data.length) / pageSize));
    } catch (err) {
      setError('获取店铺列表失败');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchShops();
  }, []);

  // 处理新增店铺
  const handleAddShop = async () => {
    try {
      await shopApi.createShop(currentShop);
      setIsAddModalOpen(false);
      // 重置表单
      setCurrentShop({
        name: '',
        email: '',
        address: '',
        type: 'retail',
        contact: '',
        rating: null,
        latitude: null,
        longitude: null,
        otherInfo: null,
        imageBase64: null,
        description: null
      });
      // 重新获取列表
      fetchShops();
    } catch (err) {
      setError('创建店铺失败');
      console.error('Error adding shop:', err);
    }
  };

  // 处理编辑店铺
  const handleEditShop = async () => {
    try {
      const shopId = typeof currentShop.id === 'string' ? parseInt(currentShop.id) : currentShop.id;
      await shopApi.updateShop(shopId, currentShop);
      setIsEditModalOpen(false);
      // 重新获取列表
      fetchShops();
    } catch (err) {
      setError('更新店铺失败');
      console.error('Error updating shop:', err);
    }
  };

  // 处理删除店铺
  const handleDeleteShop = async (id: number | string) => {
    if (window.confirm('确定要删除这个店铺吗？')) {
      try {
        const shopId = typeof id === 'string' ? parseInt(id) : id;
        await shopApi.deleteShop(shopId);
        // 重新获取列表
        fetchShops();
      } catch (err) {
        setError('删除店铺失败');
        console.error('Error deleting shop:', err);
      }
    }
  };

  // 打开编辑模态框
  const openEditModal = (shop: Shop) => {
    setCurrentShop(shop);
    setIsEditModalOpen(true);
  };

  // 过滤店铺列表
  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || shop.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>店铺管理</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span>➕</span> 新增店铺
        </button>
      </div>
      
      <div className="search-filter">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="搜索店铺名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn">搜索</button>
        </div>
        <div className="filter-box">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">全部类型</option>
            <option value="retail">零售</option>
            <option value="restaurant">餐饮</option>
            <option value="service">服务</option>
            <option value="other">其他</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>店铺名称</th>
                <th>邮箱</th>
                <th>地址</th>
                <th>类型</th>
                <th>联系人</th>
                <th>评分</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map((shop) => (
                <tr key={shop.id}>
                  <td>{shop.id}</td>
                  <td>{shop.name}</td>
                  <td>{shop.email}</td>
                  <td>{shop.address}</td>
                  <td>
                    <span className={`status ${shop.type ? 'success' : 'warning'}`}>
                      {shop.type === 'retail' ? '零售' : 
                       shop.type === 'restaurant' ? '餐饮' : 
                       shop.type === 'service' ? '服务' : '其他'}
                    </span>
                  </td>
                  <td>{shop.contact}</td>
                  <td>{shop.rating || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => openEditModal(shop)}
                      >
                        编辑
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteShop(shop.id)}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="pagination">
        <button 
          className="btn btn-sm" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          上一页
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            className={`btn btn-sm ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button 
          className="btn btn-sm" 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          下一页
        </button>
        <div className="pagination-info">
          共 {totalItems} 条记录，每页 {pageSize} 条
        </div>
      </div>

      {/* 新增店铺模态框 */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>新增店铺</h2>
              <button 
                className="close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>店铺名称</label>
                <input 
                  type="text" 
                  value={currentShop.name}
                  onChange={(e) => setCurrentShop({...currentShop, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input 
                  type="email" 
                  value={currentShop.email}
                  onChange={(e) => setCurrentShop({...currentShop, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>地址</label>
                <input 
                  type="text" 
                  value={currentShop.address}
                  onChange={(e) => setCurrentShop({...currentShop, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>类型</label>
                <select
                  value={currentShop.type}
                  onChange={(e) => setCurrentShop({...currentShop, type: e.target.value as TypeList})}
                >
                  <option value="retail">零售</option>
                  <option value="restaurant">餐饮</option>
                  <option value="service">服务</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="form-group">
                <label>联系人</label>
                <input 
                  type="text" 
                  value={currentShop.contact}
                  onChange={(e) => setCurrentShop({...currentShop, contact: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>评分</label>
                <input 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.1"
                  value={currentShop.rating || ''}
                  onChange={(e) => setCurrentShop({...currentShop, rating: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>
              <div className="form-group">
                <label>纬度</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={currentShop.latitude || ''}
                  onChange={(e) => setCurrentShop({...currentShop, latitude: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>
              <div className="form-group">
                <label>经度</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={currentShop.longitude || ''}
                  onChange={(e) => setCurrentShop({...currentShop, longitude: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>
              <div className="form-group">
                <label>其他信息</label>
                <textarea 
                  value={currentShop.otherInfo || ''}
                  onChange={(e) => setCurrentShop({...currentShop, otherInfo: e.target.value || null})}
                />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea 
                  value={currentShop.description || ''}
                  onChange={(e) => setCurrentShop({...currentShop, description: e.target.value || null})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                取消
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddShop}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑店铺模态框 */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>编辑店铺</h2>
              <button 
                className="close-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>店铺名称</label>
                <input 
                  type="text" 
                  value={currentShop.name}
                  onChange={(e) => setCurrentShop({...currentShop, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input 
                  type="email" 
                  value={currentShop.email}
                  onChange={(e) => setCurrentShop({...currentShop, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>地址</label>
                <input 
                  type="text" 
                  value={currentShop.address}
                  onChange={(e) => setCurrentShop({...currentShop, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>类型</label>
                <select
                  value={currentShop.type}
                  onChange={(e) => setCurrentShop({...currentShop, type: e.target.value as TypeList})}
                >
                  <option value="retail">零售</option>
                  <option value="restaurant">餐饮</option>
                  <option value="service">服务</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="form-group">
                <label>联系人</label>
                <input 
                  type="text" 
                  value={currentShop.contact}
                  onChange={(e) => setCurrentShop({...currentShop, contact: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>评分</label>
                <input 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.1"
                  value={currentShop.rating || ''}
                  onChange={(e) => setCurrentShop({...currentShop, rating: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>
              <div className="form-group">
                <label>纬度</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={currentShop.latitude || ''}
                  onChange={(e) => setCurrentShop({...currentShop, latitude: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>
              <div className="form-group">
                <label>经度</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={currentShop.longitude || ''}
                  onChange={(e) => setCurrentShop({...currentShop, longitude: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>
              <div className="form-group">
                <label>其他信息</label>
                <textarea 
                  value={currentShop.otherInfo || ''}
                  onChange={(e) => setCurrentShop({...currentShop, otherInfo: e.target.value || null})}
                />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea 
                  value={currentShop.description || ''}
                  onChange={(e) => setCurrentShop({...currentShop, description: e.target.value || null})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                取消
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEditShop}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shops;