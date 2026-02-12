import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Tag, Tooltip, Pagination } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { Message } from '@arco-design/web-react'
import { typeApi } from '../services/api';

interface Type {
  id?: string | number;
  name: string;
  description?: string;
}

const Types: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<Type>({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 获取类型列表
  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await typeApi.getTypes(currentPage, pageSize);
      setTypes(response.data.data || []);
      setTotalItems(response.data.total || 0);
      setTotalPages(Math.ceil((response.data.total || 0) / pageSize));
    } catch (err) {
      setError('获取类型列表失败');
      console.error('Error fetching types:', err);
    } finally {
      setLoading(false);
    }
  };

  // 新增类型
  const handleAddType = async () => {
    if (!currentType.name) {
      Message.warning('类型名称不能为空');
      return;
    }

    try {
      await typeApi.createType(currentType);
      // alert('类型添加成功');
      Message.success('类型添加成功');

      // 重置表单数据
      setCurrentType({ name: '', description: '' });
      setIsAddModalOpen(false);
      // 重新获取类型列表
      fetchTypes();
    } catch (error: any) {
      // 解析错误信息
      if (error.response?.data?.data === 'type name already exists') {
        Message.error(error.response.data.message || '类型名称已存在');
      } else {
        Message.error('类型添加失败');
      }
      console.error('Error adding type:', error);
    }
  };

  // 编辑类型
  const handleEditType = async () => {
    if (!currentType.name) {
      Message.warning('类型名称不能为空');
      return;
    }

    try {
      await typeApi.updateType(currentType.id as number, currentType);
      Message.success('类型更新成功');
      setIsEditModalOpen(false);
      // 重新获取类型列表
      fetchTypes();
    } catch (error: any) {
      // 解析错误信息
      if (error.response?.data?.data === 'type name already exists') {
        Message.error(error.response.data.message || '类型名称已存在');
      } else if (error.response?.data?.data === 'type not found') {
        Message.error(error.response.data.message || '类型不存在');
      } else {
        Message.error('类型更新失败');
      }
      console.error('Error updating type:', error);
    }
  };

  // 删除类型
  const handleDeleteType = async (id: number) => {
    if (window.confirm('确定要删除这个类型吗？')) {
      try {
        await typeApi.deleteType(id);
        Message.success('类型删除成功');
        // 重新获取类型列表
        fetchTypes();
      } catch (error: any) {
        // 解析错误信息
        if (error.response?.data?.data === 'type not found') {
          Message.error(error.response.data.message || '类型不存在');
        } else {
          Message.error('类型删除失败');
        }
        console.error('Error deleting type:', error);
      }
    }
  };

  // 打开编辑模态框
  const openEditModal = (type: Type) => {
    setCurrentType(type);
    setIsEditModalOpen(true);
  };

  // 初始加载数据
  useEffect(() => {
    fetchTypes();
  }, [currentPage, pageSize]);

  // 处理分页变化
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 表格列配置
  const columns = [
    {
      title: '类型名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Tag color="blue">{name}</Tag>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Type) => (
        <>
          <Tooltip content="编辑">
            <Button 
              icon={<IconEdit />} 
              theme="borderless" 
              size="small" 
              onClick={() => openEditModal(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip content="删除">
            <Button 
              icon={<IconDelete />} 
              theme="borderless" 
              size="small" 
              onClick={() => handleDeleteType(record.id as number)}
              style={{ color: 'red' }}
            />
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <div className="types-page">
      <div className="page-header">
        <h1>类型管理</h1>
        <Button 
          icon={<IconPlus />} 
          type="primary" 
          onClick={() => setIsAddModalOpen(true)}
        >
          新增类型
        </Button>
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
            columns={columns} 
            dataSource={types} 
            rowKey="id"
            pagination={false}
          />
        </div>
      )}
      
      <div className="pagination">
        <Pagination 
          total={totalItems} 
          pageSize={pageSize}
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100]}
          style={{ marginBottom: 12 }}
        />
        <div className="pagination-info">
          共 {totalItems} 条记录，每页 {pageSize} 条
        </div>
      </div>

      {/* 新增类型模态框 */}
      <Modal
        title="新增类型"
        visible={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => { handleAddType(); }}
        okButtonProps={{ type: 'primary' }}
        cancelButtonProps={{}}
        width={500}
      >
        <Form
          labelPosition="left"
          labelWidth="80px"
          initValues={currentType}
          onValueChange={(values) => setCurrentType(values as Type)}
        >
          <Form.Input
            field="name"
            label="类型名称"
            required
          />
          <Form.Input
            field="description"
            label="描述"
          />
        </Form>
      </Modal>

      {/* 编辑类型模态框 */}
      <Modal
        title="编辑类型"
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => { handleEditType(); }}
        okButtonProps={{ type: 'primary' }}
        cancelButtonProps={{}}
        width={500}
      >
        <Form
          labelPosition="left"
          labelWidth="80px"
          initValues={currentType}
          onValueChange={(values) => setCurrentType(values as Type)}
        >
          <Form.Input
            field="name"
            label="类型名称"
            required
          />
          <Form.Input
            field="description"
            label="描述"
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Types;