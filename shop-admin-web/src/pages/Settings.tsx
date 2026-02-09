import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>系统设置</h1>
      </div>
      
      <div className="settings-container">
        <div className="settings-section">
          <h2>基本设置</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>系统名称</label>
              <input type="text" defaultValue="店铺管理系统" />
            </div>
            <div className="form-group">
              <label>系统版本</label>
              <input type="text" defaultValue="v1.0.0" disabled />
            </div>
            <div className="form-group">
              <label>系统描述</label>
              <textarea defaultValue="电商后台管理系统，用于管理店铺、商品和评价等信息。"></textarea>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary">保存设置</button>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>数据库设置</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>数据库类型</label>
              <select defaultValue="mysql">
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>
            <div className="form-group">
              <label>数据库主机</label>
              <input type="text" defaultValue="localhost" />
            </div>
            <div className="form-group">
              <label>数据库端口</label>
              <input type="text" defaultValue="3306" />
            </div>
            <div className="form-group">
              <label>数据库名称</label>
              <input type="text" defaultValue="shop_admin" />
            </div>
            <div className="form-group">
              <label>数据库用户名</label>
              <input type="text" defaultValue="root" />
            </div>
            <div className="form-group">
              <label>数据库密码</label>
              <input type="password" defaultValue="********" />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary">测试连接</button>
              <button className="btn btn-primary">保存设置</button>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>邮件设置</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>SMTP服务器</label>
              <input type="text" defaultValue="smtp.example.com" />
            </div>
            <div className="form-group">
              <label>SMTP端口</label>
              <input type="text" defaultValue="587" />
            </div>
            <div className="form-group">
              <label>发件人邮箱</label>
              <input type="email" defaultValue="admin@example.com" />
            </div>
            <div className="form-group">
              <label>发件人名称</label>
              <input type="text" defaultValue="店铺管理系统" />
            </div>
            <div className="form-group">
              <label>SMTP用户名</label>
              <input type="text" defaultValue="admin@example.com" />
            </div>
            <div className="form-group">
              <label>SMTP密码</label>
              <input type="password" defaultValue="********" />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary">测试邮件</button>
              <button className="btn btn-primary">保存设置</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;