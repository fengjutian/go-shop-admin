import React from 'react';

const Shops: React.FC = () => {
  // 模拟店铺数据
  const shops = [
    { id: 1, name: '星巴克咖啡店', address: '北京市朝阳区建国路88号', phone: '010-12345678', status: 'active' },
    { id: 2, name: '肯德基餐厅', address: '上海市浦东新区世纪大道100号', phone: '021-87654321', status: 'active' },
    { id: 3, name: '麦当劳餐厅', address: '广州市天河区天河路385号', phone: '020-13579246', status: 'active' },
    { id: 4, name: '必胜客餐厅', address: '深圳市南山区科技园南区', phone: '0755-24681357', status: 'inactive' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>店铺管理</h1>
        <button className="btn btn-primary">
          <span>➕</span> 新增店铺
        </button>
      </div>
      
      <div className="search-filter">
        <div className="search-box">
          <input type="text" placeholder="搜索店铺名称..." />
          <button className="btn">搜索</button>
        </div>
        <div className="filter-box">
          <select>
            <option value="all">全部状态</option>
            <option value="active">营业中</option>
            <option value="inactive">已关闭</option>
          </select>
        </div>
      </div>
      
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
            {shops.map((shop) => (
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

export default Shops;