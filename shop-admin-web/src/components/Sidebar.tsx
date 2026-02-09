import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', name: '仪表盘', icon: '📊' },
    { id: 'shops', name: '店铺管理', icon: '🏪' },
    { id: 'products', name: '商品管理', icon: '🛍️' },
    { id: 'reviews', name: '评价管理', icon: '⭐' },
    { id: 'users', name: '用户管理', icon: '👥' },
    { id: 'settings', name: '系统设置', icon: '⚙️' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className={`sidebar-title ${collapsed ? 'collapsed' : ''}`}>
          店铺管理
        </h2>
        <button 
          className="toggle-btn" 
          onClick={onToggle}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item">
              <a href={`#${item.id}`} className="menu-link">
                <span className="menu-icon">{item.icon}</span>
                <span className={`menu-text ${collapsed ? 'hidden' : ''}`}>
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className={`user-info ${collapsed ? 'collapsed' : ''}`}>
          <div className="user-avatar">👤</div>
          <div className={`user-details ${collapsed ? 'hidden' : ''}`}>
            <p className="user-name">管理员</p>
            <p className="user-role">超级管理员</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;