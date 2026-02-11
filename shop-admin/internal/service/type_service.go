package service

import (
	"shop-admin/internal/model"
	"shop-admin/internal/repository"
)

// TypeService 类型服务接口
type TypeService interface {
	CreateType(shopType *model.ShopType) error
	UpdateType(shopType *model.ShopType) error
	DeleteType(id uint) error
	GetType(id uint) (*model.ShopType, error)
	ListTypes() ([]*model.ShopType, error)
}

// typeService 类型服务实现
type typeService struct {
	repo repository.TypeRepository
}

// NewTypeService 创建类型服务实例
func NewTypeService(repo repository.TypeRepository) TypeService {
	return &typeService{repo: repo}
}

// CreateType 创建类型
func (s *typeService) CreateType(shopType *model.ShopType) error {
	return s.repo.Create(shopType)
}

// UpdateType 更新类型
func (s *typeService) UpdateType(shopType *model.ShopType) error {
	return s.repo.Update(shopType)
}

// DeleteType 删除类型
func (s *typeService) DeleteType(id uint) error {
	return s.repo.Delete(id)
}

// GetType 获取类型详情
func (s *typeService) GetType(id uint) (*model.ShopType, error) {
	return s.repo.Get(id)
}

// ListTypes 获取类型列表
func (s *typeService) ListTypes() ([]*model.ShopType, error) {
	return s.repo.List()
}
