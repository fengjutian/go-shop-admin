import React, { useState, useEffect } from 'react';
import { Pagination, Table, Tag, Tooltip, Typography } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import { shopApi } from '../services/api';

const { Text } = Typography;

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
      const response = await shopApi.getShops(currentPage, pageSize);
      const shopsData = response.data;
      setShops(Array.isArray(shopsData.data) ? shopsData.data : []);
      setTotalItems(shopsData.total || 0);
      setTotalPages(Math.ceil((shopsData.total || 0) / pageSize));
    } catch (err) {
      setError('获取店铺列表失败');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和分页参数变化时重新获取数据
  useEffect(() => {
    fetchShops();
  }, [currentPage, pageSize]);

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
          <Table 
            scroll={{ y: 850 }}
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
              },
              {
                title: '店铺名称',
                dataIndex: 'name',
                width: 100,
                render: (text) => {
                  return (
                    <Text ellipsis={{ showTooltip: true }}>
                      {text}
                    </Text>
                  );
                },
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                width: 100,
                render: (text) => {
                  return (
                    <Text ellipsis={{ showTooltip: true }}>
                      {text || '-'}
                    </Text>
                  );
                },
              },
              {
                title: '地址',
                dataIndex: 'address',
                width: 100,
                render: (text) => {
                  return (
                    <Text ellipsis={{ showTooltip: true }}>
                      {text || '-'}
                    </Text>
                  );
                },
              },
              {
                title: '类型',
                dataIndex: 'type',
                render: (text) => {
                  const typeConfig = {
                    retail: { color: 'blue', text: '零售' },
                    restaurant: { color: 'green', text: '餐饮' },
                    service: { color: 'orange', text: '服务' },
                    other: { color: 'purple', text: '其他' },
                  };
                  const typeProps = typeConfig[text] || { color: 'grey', text: '其他' };
                  return <Tag {...typeProps}>{typeProps.text}</Tag>;
                },
              },
              {
                title: '联系人',
                dataIndex: 'contact',
                width: 150,
                render: (text) => {
                  return (
                    <Text ellipsis={{ showTooltip: true }}>
                      {text || '-'}
                    </Text>
                  );
                },
              },
              {
                title: '评分',
                dataIndex: 'rating',
                render: (text) => text || '-',
              },
              {
                title: '操作',
                dataIndex: 'operate',
                render: (_, record) => (
                  <div className="action-buttons">
                    <Tooltip content="编辑店铺">
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => openEditModal(record)}
                      >
                        <IconEdit style={{ marginRight: 4 }} />
                        编辑
                      </button>
                    </Tooltip>
                    <Tooltip content="删除店铺">
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteShop(record.id)}
                      >
                        <IconDelete style={{ marginRight: 4 }} />
                        删除
                      </button>
                    </Tooltip>
                  </div>
                ),
              },
            ]} 
            dataSource={filteredShops.map(shop => ({ ...shop, key: shop.id }))} 
            pagination={false} 
          />
        </div>
      )}
      
      <div className="pagination">
        <Pagination 
          total={totalItems} 
          pageSize={pageSize}
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginBottom: 12 }}
        />
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