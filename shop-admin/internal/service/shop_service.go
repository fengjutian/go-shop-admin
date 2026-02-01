package service

import (
	"shop-admin/internal/model"
	"shop-admin/internal/repository"
)

// ShopService 店铺服务接口
type ShopService interface {
	CreateShop(shop *model.Shop) error
	UpdateShop(shop *model.Shop) error
	DeleteShop(id uint) error
	GetShopByID(id uint) (*model.Shop, error)
	ListShops() ([]*model.Shop, error)
}

// shopService 店铺服务实现
type shopService struct {
	repo repository.ShopRepository
}

// NewShopService 创建店铺服务实例
func NewShopService(repo repository.ShopRepository) ShopService {
	return &shopService{repo: repo}
}

// CreateShop 创建店铺
func (s *shopService) CreateShop(shop *model.Shop) error {
	return s.repo.Create(shop)
}

// UpdateShop 更新店铺
func (s *shopService) UpdateShop(shop *model.Shop) error {
	return s.repo.Update(shop)
}

// DeleteShop 删除店铺
func (s *shopService) DeleteShop(id uint) error {
	return s.repo.Delete(id)
}

// GetShopByID 根据ID获取店铺
func (s *shopService) GetShopByID(id uint) (*model.Shop, error) {
	return s.repo.GetByID(id)
}

// ListShops 获取店铺列表
func (s *shopService) ListShops() ([]*model.Shop, error) {
	return s.repo.List()
}
