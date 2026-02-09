import React, { useState, useEffect } from 'react';
import { shopApi } from '../services/api';

interface Shop {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: string;
}

const Shops: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<Shop>({
    id: 0,
    name: '',
    address: '',
    phone: '',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 获取店铺列表
  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await shopApi.getShops();
      setShops(response.data);
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
        id: 0,
        name: '',
        address: '',
        phone: '',
        status: 'active'
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
      await shopApi.updateShop(currentShop.id, currentShop);
      setIsEditModalOpen(false);
      // 重新获取列表
      fetchShops();
    } catch (err) {
      setError('更新店铺失败');
      console.error('Error updating shop:', err);
    }
  };

  // 处理删除店铺
  const handleDeleteShop = async (id: number) => {
    if (window.confirm('确定要删除这个店铺吗？')) {
      try {
        await shopApi.deleteShop(id);
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
    const matchesStatus = statusFilter === 'all' || shop.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="active">营业中</option>
            <option value="inactive">已关闭</option>
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
                <th>地址</th>
                <th>联系电话</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map((shop) => (
                <tr key={shop.id}>
                  <td>{shop.id}</td>
                  <td>{shop.name}</td>
                  <td>{shop.address}</td>
                  <td>{shop.phone}</td>
                  <td>
                    <span className={`status ${shop.status === 'active' ? 'success' : 'warning'}`}>
                      {shop.status === 'active' ? '营业中' : '已关闭'}
                    </span>
                  </td>
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
        <button className="btn btn-sm">上一页</button>
        <button className="btn btn-sm active">1</button>
        <button className="btn btn-sm">2</button>
        <button className="btn btn-sm">3</button>
        <button className="btn btn-sm">下一页</button>
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
                <label>联系电话</label>
                <input 
                  type="text" 
                  value={currentShop.phone}
                  onChange={(e) => setCurrentShop({...currentShop, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={currentShop.status}
                  onChange={(e) => setCurrentShop({...currentShop, status: e.target.value})}
                >
                  <option value="active">营业中</option>
                  <option value="inactive">已关闭</option>
                </select>
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
                <label>联系电话</label>
                <input 
                  type="text" 
                  value={currentShop.phone}
                  onChange={(e) => setCurrentShop({...currentShop, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={currentShop.status}
                  onChange={(e) => setCurrentShop({...currentShop, status: e.target.value})}
                >
                  <option value="active">营业中</option>
                  <option value="inactive">已关闭</option>
                </select>
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