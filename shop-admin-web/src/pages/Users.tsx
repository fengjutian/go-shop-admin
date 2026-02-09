import React from 'react';

const Users: React.FC = () => {
  // 模拟用户数据
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'manager', status: 'active' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'staff', status: 'active' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'staff', status: 'inactive' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>用户管理</h1>
        <button className="btn btn-primary">
          <span>➕</span> 新增用户
        </button>
      </div>
      
      <div className="search-filter">
        <div className="search-box">
          <input type="text" placeholder="搜索用户名称或邮箱..." />
          <button className="btn">搜索</button>
        </div>
        <div className="filter-box">
          <select>
            <option value="all">全部角色</option>
            <option value="admin">超级管理员</option>
            <option value="manager">管理员</option>
            <option value="staff">普通员工</option>
          </select>
        </div>
      </div>
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名称</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-tag ${user.role}`}>
                    {user.role === 'admin' ? '超级管理员' : user.role === 'manager' ? '管理员' : '普通员工'}
                  </span>
                </td>
                <td>
                  <span className={`status ${user.status === 'active' ? 'success' : 'warning'}`}>
                    {user.status === 'active' ? '活跃' : '已禁用'}
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

export default Users;