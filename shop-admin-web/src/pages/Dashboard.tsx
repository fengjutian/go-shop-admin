import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="page-content">
      <h1>仪表盘</h1>
      <div className="dashboard-overview">
        <div className="overview-section">
          <h2>业务概览</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏪</div>
              <div className="stat-content">
                <p className="stat-label">店铺总数</p>
                <p className="stat-value">128</p>
                <p className="stat-change positive">+2 今日</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div className="stat-content">
                <p className="stat-label">商品总数</p>
                <p className="stat-value">3,456</p>
                <p className="stat-change positive">+15 今日</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <p className="stat-label">评价总数</p>
                <p className="stat-value">8,921</p>
                <p className="stat-change positive">+23 今日</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <p className="stat-label">用户总数</p>
                <p className="stat-value">15,678</p>
                <p className="stat-change positive">+45 今日</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overview-section">
          <h2>最近活动</h2>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>类型</th>
                  <th>内容</th>
                  <th>时间</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="activity-type create">创建</span></td>
                  <td>新增了店铺 <strong>星巴克咖啡店</strong></td>
                  <td>2分钟前</td>
                  <td><span className="status success">成功</span></td>
                </tr>
                <tr>
                  <td><span className="activity-type update">更新</span></td>
                  <td>更新了商品 <strong>iPhone 15 Pro</strong> 的价格</td>
                  <td>15分钟前</td>
                  <td><span className="status success">成功</span></td>
                </tr>
                <tr>
                  <td><span className="activity-type review">评价</span></td>
                  <td>收到了商品 <strong>MacBook Pro</strong> 的评价</td>
                  <td>1小时前</td>
                  <td><span className="status success">成功</span></td>
                </tr>
                <tr>
                  <td><span className="activity-type delete">删除</span></td>
                  <td>删除了商品 <strong>旧款 MacBook Air</strong></td>
                  <td>2小时前</td>
                  <td><span className="status success">成功</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;