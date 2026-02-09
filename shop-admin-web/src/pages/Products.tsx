import React from 'react';

const Products: React.FC = () => {
  // 模拟商品数据
  const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 9999, stock: 100, shopId: 1, shopName: '星巴克咖啡店', status: 'active' },
    { id: 2, name: 'MacBook Pro', price: 19999, stock: 50, shopId: 2, shopName: '肯德基餐厅', status: 'active' },
    { id: 3, name: 'AirPods Pro', price: 1999, stock: 200, shopId: 3, shopName: '麦当劳餐厅', status: 'active' },
    { id: 4, name: 'iPad Pro', price: 8999, stock: 80, shopId: 4, shopName: '必胜客餐厅', status: 'inactive' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>商品管理</h1>
        <button className="btn btn-primary">
          <span>➕</span> 新增商品
        </button>
      </div>
      
      <div className="search-filter">
        <div className="search-box">
          <input type="text" placeholder="搜索商品名称..." />
          <button className="btn">搜索</button>
        </div>
        <div className="filter-box">
          <select>
            <option value="all">全部店铺</option>
            <option value="1">星巴克咖啡店</option>
            <option value="2">肯德基餐厅</option>
            <option value="3">麦当劳餐厅</option>
            <option value="4">必胜客餐厅</option>
          </select>
        </div>
      </div>
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>商品名称</th>
              <th>价格</th>
              <th>库存</th>
              <th>所属店铺</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>¥{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.shopName}</td>
                <td>
                  <span className={`status ${product.status === 'active' ? 'success' : 'warning'}`}>
                    {product.status === 'active' ? '在售' : '下架'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-info">编辑</button>
                    <button className="btn btn-sm btn-danger">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button className="btn btn-sm">上一页</button>
        <button className="btn btn-sm active">1</button>
        <button className="btn btn-sm">2</button>
        <button className="btn btn-sm">3</button>
        <button className="btn btn-sm">下一页</button>
      </div>
    </div>
  );
};

export default Products;