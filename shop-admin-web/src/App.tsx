import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './components/Sidebar.css'
import Dashboard from './pages/Dashboard'
import Shops from './pages/Shops'
import Types from './pages/Types'
import Products from './pages/Products'
import Reviews from './pages/Reviews'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Map from './pages/Map'

// 主内容组件，包含路由和页面切换
const MainContent: React.FC<{ sidebarCollapsed: boolean }> = ({ sidebarCollapsed }) => {
  return (
    <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* <header className="main-header">
        <div className="header-title">
          <h1>{getPageTitle()}</h1>
        </div>
        <div className="header-actions">
          <button className="btn">
            <span>📤</span> 导出数据
          </button>
          <button className="btn btn-primary">
            <span>➕</span> 新增
          </button>
        </div>
      </header> */}
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/map" element={<Map />} />
          <Route path="/types" element={<Types />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </main>
  )
}

// 侧边栏菜单项组件，使用 Link 导航
const SidebarWithRoutes: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', name: '仪表盘', icon: '📊', path: '/dashboard' },
    { id: 'shops', name: '店铺管理', icon: '🏪', path: '/shops' },
    { id: 'map', name: '商铺地图显示', icon: '🗺️', path: '/map' },
    { id: 'types', name: '类型管理', icon: '📦', path: '/types' },
    { id: 'products', name: '商品管理', icon: '🛍️', path: '/products' },
    { id: 'reviews', name: '评价管理', icon: '⭐', path: '/reviews' },
    { id: 'users', name: '用户管理', icon: '👥', path: '/users' },
    { id: 'settings', name: '系统设置', icon: '⚙️', path: '/settings' },
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
              <Link to={item.path} className="menu-link">
                <span className="menu-icon">{item.icon}</span>
                <span className={`menu-text ${collapsed ? 'hidden' : ''}`}>
                  {item.name}
                </span>
              </Link>
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

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <Router>
      <div className="app">
        <SidebarWithRoutes 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        <MainContent sidebarCollapsed={sidebarCollapsed} />
      </div>
    </Router>
  )
}

export default App
