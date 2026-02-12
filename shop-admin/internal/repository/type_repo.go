package repository

import (
	"errors"
	"shop-admin/internal/model"

	"gorm.io/gorm"
)

// TypeRepository 类型仓库接口
type TypeRepository interface {
	Create(shopType *model.ShopType) error
	Update(shopType *model.ShopType) error
	Delete(id uint) error
	Get(id uint) (*model.ShopType, error)
	List() ([]*model.ShopType, error)
}

// typeRepository 类型仓库实现
type typeRepository struct {
	db *gorm.DB
}

// NewTypeRepository 创建类型仓库实例
func NewTypeRepository(db *gorm.DB) TypeRepository {
	return &typeRepository{db: db}
}

// Create 创建类型
func (r *typeRepository) Create(shopType *model.ShopType) error {
	// 检查类型名称是否已存在
	var existingType model.ShopType
	if err := r.db.Where("name = ?", shopType.Name).First(&existingType).Error; err == nil {
		// 类型名称已存在
		return errors.New("type name already exists")
	}
	
	// 类型名称不存在，创建类型
	return r.db.Create(shopType).Error
}

// Update 更新类型
func (r *typeRepository) Update(shopType *model.ShopType) error {
	// 检查类型是否存在
	var existingType model.ShopType
	if err := r.db.First(&existingType, shopType.ID).Error; err != nil {
		return errors.New("type not found")
	}
	
	// 检查类型名称是否已被其他类型使用
	if existingType.Name != shopType.Name {
		var duplicateType model.ShopType
		if err := r.db.Where("name = ? AND id != ?", shopType.Name, shopType.ID).First(&duplicateType).Error; err == nil {
			return errors.New("type name already exists")
		}
	}
	
	// 更新类型
	return r.db.Save(shopType).Error
}

// Delete 删除类型
func (r *typeRepository) Delete(id uint) error {
	// 检查类型是否存在
	var existingType model.ShopType
	if err := r.db.First(&existingType, id).Error; err != nil {
		return errors.New("type not found")
	}
	
	// 删除类型
	return r.db.Delete(&existingType).Error
}

// Get 获取类型详情
func (r *typeRepository) Get(id uint) (*model.ShopType, error) {
	var shopType model.ShopType
	if err := r.db.First(&shopType, id).Error; err != nil {
		return nil, errors.New("type not found")
	}
	return &shopType, nil
}

// List 获取类型列表
func (r *typeRepository) List() ([]*model.ShopType, error) {
	var types []*model.ShopType
	if err := r.db.Order("created_at DESC").Find(&types).Error; err != nil {
		return nil, err
	}
	return types, nil
}
