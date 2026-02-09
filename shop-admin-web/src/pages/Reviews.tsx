import React from 'react';

const Reviews: React.FC = () => {
  // 模拟评价数据
  const reviews = [
    { id: 1, content: '商品质量非常好，物流也很快，非常满意！', rating: 5, productId: 1, productName: 'iPhone 15 Pro', createdAt: '2026-02-10 10:00:00', status: 'approved' },
    { id: 2, content: '商品不错，但是价格有点贵', rating: 4, productId: 2, productName: 'MacBook Pro', createdAt: '2026-02-10 09:30:00', status: 'approved' },
    { id: 3, content: '物流太慢了，等了一个星期才到货', rating: 2, productId: 3, productName: 'AirPods Pro', createdAt: '2026-02-10 08:15:00', status: 'approved' },
    { id: 4, content: '商品与描述不符，退货了', rating: 1, productId: 4, productName: 'iPad Pro', createdAt: '2026-02-10 07:45:00', status: 'pending' },
  ];

  // 生成星级评分显示
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>评价管理</h1>
      </div>
      
      <div className="search-filter">
        <div className="search-box">
          <input type="text" placeholder="搜索评价内容..." />
          <button className="btn">搜索</button>
        </div>
        <div className="filter-box">
          <select>
            <option value="all">全部状态</option>
            <option value="approved">已审核</option>
            <option value="pending">待审核</option>
          </select>
        </div>
      </div>
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>评价内容</th>
              <th>评分</th>
              <th>商品名称</th>
              <th>创建时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td className="review-content">{review.content}</td>
                <td className="rating">{renderRating(review.rating)}</td>
                <td>{review.productName}</td>
                <td>{review.createdAt}</td>
                <td>
                  <span className={`status ${review.status === 'approved' ? 'success' : 'warning'}`}>
                    {review.status === 'approved' ? '已审核' : '待审核'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-info">查看</button>
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

export default Reviews;