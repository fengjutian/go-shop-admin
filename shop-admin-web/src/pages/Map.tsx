import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Spin, Descriptions, Tag } from '@douyinfe/semi-ui';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shopApi } from '../services/api';

const { Title } = Typography;

interface Shop {
  id?: string | number;
  name: string;
  email: string;
  address?: string;
  type?: string;
  contact?: string;
  rating?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  otherInfo?: string | null;
  imageBase64?: string | null;
  description?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [amapInstance, setAmapInstance] = useState<any>(null);

  // 获取店铺数据
  const fetchShops = async () => {
    try {
      console.log('开始获取店铺数据...');
      // 尝试获取所有店铺，使用更大的pageSize
      const shopsData = await shopApi.getShops(1, 100000); // 获取所有店铺
      console.log('API响应数据:', shopsData);
      
      // 检查响应结构
      if (!shopsData) {
        console.error('API响应数据为空:', shopsData);
        setShops([]);
        return;
      }
      
      // 检查data字段
      if (!shopsData.data) {
        console.error('店铺数据中没有data字段:', shopsData);
        setShops([]);
        return;
      }
      
      const shopsList = Array.isArray(shopsData.data.data) ? shopsData.data.data : [];
      console.log('处理后的店铺列表:', shopsList);
      console.log('店铺数量:', shopsList.length);
      
      // 过滤出有经纬度的店铺
      const shopsWithCoords = shopsList.filter((shop: Shop) => 
        shop.latitude && shop.longitude
      );
      console.log('有经纬度的店铺数量:', shopsWithCoords.length);
      
      // 打印有经纬度的店铺
      console.log('有经纬度的店铺:', shopsWithCoords);
      
      setShops(shopsList);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化地图
  useEffect(() => {
    fetchShops();
  }, []);

  // 初始化地图
  useEffect(() => {
    let isMounted = true;
    
    // 确保地图容器存在
    if (!mapRef.current) {
      console.error('地图容器不存在');
      return;
    }

    console.log('开始初始化地图...');

    // 加载地图API
    AMapLoader.load({
      key: '5131350db8ad49230fd4c7f3cab4f1d8', // 请替换为您的高德地图API密钥
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.InfoWindow'],
    })
      .then((AMap: any) => {
        if (!isMounted) return;
        
        try {
          console.log('地图API加载成功，创建地图实例...');
          // 创建地图实例
          mapInstance.current = new AMap.Map(mapRef.current, {
            viewMode: '3D',
            zoom: 14,
            center: [118.820778, 31.931948], // 默认中心点
          });

          // 保存地图实例和AMap对象
          setAmapInstance(AMap);
          setMapInitialized(true);

          // 添加工具条和比例尺
          mapInstance.current.addControl(new AMap.ToolBar());
          mapInstance.current.addControl(new AMap.Scale());

          console.log('地图初始化完成');
          
          // 初始化后添加标记
          addShopMarkers(AMap);
        } catch (error) {
          console.error('创建地图实例失败:', error);
        }
      })
      .catch((e: any) => {
        console.error('地图加载失败:', e);
      });

    return () => {
      isMounted = false;
      console.log('组件卸载，清理地图资源...');
      
      // 清除标记
      if (markersRef.current.length > 0) {
        console.log('清除旧标记...');
        markersRef.current.forEach(marker => {
          try {
            marker.setMap(null);
          } catch (error) {
            console.error('清除标记失败:', error);
          }
        });
        markersRef.current = [];
      }
      
      // 销毁地图实例
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
          console.log('地图实例销毁成功');
        } catch (error) {
          console.error('销毁地图实例失败:', error);
        }
        mapInstance.current = null;
        // 避免在清理函数中设置状态，可能导致React警告
      }
    };
  }, []); // 只在组件挂载时初始化一次

  // 添加店铺标记
  const addShopMarkers = (AMap: any) => {
    console.log('开始添加店铺标记...');
    console.log('店铺列表长度:', shops.length);
    console.log('地图实例是否存在:', !!mapInstance.current);
    
    // 清除旧标记
    if (markersRef.current.length > 0) {
      console.log('清除旧标记...');
      markersRef.current.forEach(marker => {
        try {
          marker.setMap(null);
        } catch (error) {
          console.error('清除标记失败:', error);
        }
      });
      markersRef.current = [];
    }
    
    if (!mapInstance.current) {
      console.error('地图实例不存在，无法添加标记');
      return;
    }
    
    if (!loading && shops.length > 0) {
      let addedMarkers = 0;
      
      console.log('处理店铺数据...');
      shops.forEach((shop: Shop, index: number) => {
        console.log(`处理店铺 ${index + 1}:`, shop.name);
        console.log(`店铺经纬度: ${shop.longitude}, ${shop.latitude}`);
        
        if (shop.latitude && shop.longitude) {
          try {
            // 打印店铺类型信息
            console.log(`店铺类型: ${shop.type}`);
            
            // 根据店铺类型选择标记颜色
            const getMarkerColor = (type: string | undefined) => {
              if (!type) {
                console.log('店铺类型为空，使用默认蓝色');
                return 'b'; // 默认蓝色
              }
              
              // 定义类型颜色映射
              const typeColorMap: Record<string, string> = {
                '中餐': 'r', // 红色
                '西餐': 'g', // 绿色
                '购物': 'b', // 蓝色
                '娱乐': 'y', // 黄色
                '酒店': 'g', // 绿色
                '景点': 'p', // 紫色
                '医疗': 'c', // 青色
                '教育': 'o', // 橙色
                '餐厅': 'r', // 红色（别名）
                '饭店': 'r', // 红色（别名）
                '商场': 'b', // 蓝色（别名）
                '超市': 'b', // 蓝色（别名）
                '影院': 'y', // 黄色（别名）
                'KTV': 'y', // 黄色（别名）
                '宾馆': 'g', // 绿色（别名）
                '公园': 'p', // 紫色（别名）
                '景区': 'p', // 紫色（别名）
                '医院': 'c', // 青色（别名）
                '诊所': 'c', // 青色（别名）
                '学校': 'o', // 橙色（别名）
                '幼儿园': 'o', // 橙色（别名）
              };
              
              // 尝试直接匹配
              if (typeColorMap[type]) {
                console.log(`匹配到店铺类型: ${type}，使用颜色: ${typeColorMap[type]}`);
                return typeColorMap[type];
              }
              
              // 尝试模糊匹配
              for (const [key, color] of Object.entries(typeColorMap)) {
                if (type.includes(key)) {
                  console.log(`模糊匹配到店铺类型: ${type} 包含 ${key}，使用颜色: ${color}`);
                  return color;
                }
              }
              
              console.log(`未匹配到店铺类型: ${type}，使用默认蓝色`);
              return 'b'; // 默认蓝色
            };
            
            const markerColor = getMarkerColor(shop.type);
            console.log(`最终选择的标记颜色: ${markerColor}`);
            
            // 创建标记
            const marker = new AMap.Marker({
              position: [shop.longitude, shop.latitude],
              title: shop.name,
              icon: new AMap.Icon({
                size: new AMap.Size(15, 15),
                image: `https://webapi.amap.com/theme/v1.3/markers/n/mark_${markerColor}.png`,
                imageSize: new AMap.Size(15, 15),
              }),
            });

            // 添加标记到地图
            marker.setMap(mapInstance.current);
            markersRef.current.push(marker);
            addedMarkers++;
            
            console.log(`成功添加标记: ${shop.name}`);

            // 创建信息窗口
            const infoWindow = new AMap.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 10px 0;">${shop.name}</h3>
                  <p style="margin: 5px 0;">地址: ${shop.address || '-'}</p>
                  <p style="margin: 5px 0;">类型: ${shop.type || '-'}</p>
                  <p style="margin: 5px 0;">联系方式: ${shop.contact || '-'}</p>
                  <p style="margin: 5px 0;">评分: ${shop.rating || '-'}</p>
                </div>
              `,
              size: new AMap.Size(300, 0),
              autoMove: true,
              closeWhenClickMap: true,
            });

            // 监听标记点击事件
            marker.on('click', () => {
              infoWindow.open(mapInstance.current, marker.getPosition());
              setSelectedShop(shop);
            });
          } catch (error) {
            console.error(`添加标记失败: ${shop.name}`, error);
          }
        } else {
          console.log(`跳过无经纬度的店铺: ${shop.name}`);
        }
      });

      console.log(`总共添加了 ${addedMarkers} 个标记`);
      console.log(`标记数组长度: ${markersRef.current.length}`);

      // 调整地图视野以显示所有标记
      if (markersRef.current.length > 0) {
        console.log('开始调整地图视野...');
        try {
          const bounds = new AMap.Bounds();
          markersRef.current.forEach((marker, index) => {
            const position = marker.getPosition();
            console.log(`标记 ${index + 1} 位置:`, position);
            bounds.extend(position);
          });
          console.log('计算的边界:', bounds);
          // 添加边距，使地图显示更加合理
          mapInstance.current.setBounds(bounds, true, [50, 50, 50, 50]);
          console.log('地图视野调整完成');
        } catch (error) {
          console.error('调整地图视野失败:', error);
          // 如果调整视野失败，使用默认中心点
          mapInstance.current.setCenter([118.820778, 31.931948]);
          mapInstance.current.setZoom(14);
        }
      } else {
        console.log('没有标记，使用默认视野');
        // 没有标记时，明确设置默认中心点和缩放级别
        mapInstance.current.setCenter([118.820778, 31.931948]);
        mapInstance.current.setZoom(14);
      }
    } else {
      console.log('没有店铺数据或数据正在加载');
      // 数据加载中或无数据时，使用默认中心点
      mapInstance.current.setCenter([118.820778, 31.931948]);
      mapInstance.current.setZoom(14);
    }
  };

  // 当店铺数据变化时更新标记
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted && mapInitialized && amapInstance) {
      console.log('店铺数据变化，更新标记...');
      console.log('地图初始化状态:', mapInitialized);
      console.log('AMap实例是否存在:', !!amapInstance);
      console.log('地图实例是否存在:', !!mapInstance.current);
      addShopMarkers(amapInstance);
    } else if (isMounted && !mapInitialized) {
      console.log('地图未初始化，等待初始化完成后添加标记...');
    } else if (isMounted && !amapInstance) {
      console.log('AMap实例不存在，等待加载完成后添加标记...');
    } else if (isMounted && !mapInstance.current) {
      console.log('地图实例不存在，等待初始化完成后添加标记...');
    }
    
    return () => {
      isMounted = false;
    };
  }, [shops, loading, mapInitialized, amapInstance]); // 当店铺数据、加载状态或地图初始化状态变化时更新标记

  return (
    <div className="map-page" style={{ padding: 0 }}>
      
      <Card style={{ marginBottom: 0 }}>
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '550px', 
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)' 
            }}>
              <Spin size="large" tip="加载地图中..." />
            </div>
          ) : null}
        </div>
      </Card>

      {selectedShop && (
        <Card title="店铺详情">
          <Descriptions column={2}>
            <Descriptions.Item label="店铺名称">{selectedShop.name}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedShop.email}</Descriptions.Item>
            <Descriptions.Item label="地址">{selectedShop.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="类型">
              {selectedShop.type ? (
                <Tag color="blue">{selectedShop.type}</Tag>
              ) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系方式">{selectedShop.contact || '-'}</Descriptions.Item>
            <Descriptions.Item label="评分">{selectedShop.rating || '-'}</Descriptions.Item>
            <Descriptions.Item label="纬度">{selectedShop.latitude || '-'}</Descriptions.Item>
            <Descriptions.Item label="经度">{selectedShop.longitude || '-'}</Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {selectedShop.description || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default Map;