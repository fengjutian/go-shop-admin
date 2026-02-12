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

  // 获取店铺列表
  const fetchShops = async () => {
    try {
      const response = await shopApi.getShops(1, 100000); // 获取所有店铺
      const shopsData = response.data;
      const shopsList = Array.isArray(shopsData.data) ? shopsData.data : [];
      setShops(shopsList);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化地图
  useEffect(() => {
    fetchShops();
  }, []);

  // 渲染地图和标记
  useEffect(() => {
    if (mapRef.current) {
      AMapLoader.load({
        key: '5131350db8ad49230fd4c7f3cab4f1d8', // 请替换为您的高德地图API密钥
        version: '2.0',
        plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.InfoWindow'],
      })
        .then((AMap: any) => {
          // 创建地图实例
          mapInstance.current = new AMap.Map(mapRef.current, {
            viewMode: '3D',
            zoom: 13,
            center: [118.820778, 31.931948], // 默认中心点
          });

          // 添加工具条和比例尺
          mapInstance.current.addControl(new AMap.ToolBar());
          mapInstance.current.addControl(new AMap.Scale());

          // 清除旧标记
          if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => {
              marker.setMap(null);
            });
            markersRef.current = [];
          }

          // 添加店铺标记
          if (!loading && shops.length > 0) {
            shops.forEach(shop => {
              if (shop.latitude && shop.longitude) {
                // 创建标记
                const marker = new AMap.Marker({
                  position: [shop.longitude, shop.latitude],
                  title: shop.name,
                  icon: new AMap.Icon({
                    size: new AMap.Size(32, 32),
                    image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    imageSize: new AMap.Size(32, 32),
                  }),
                });

                // 添加标记到地图
                marker.setMap(mapInstance.current);
                markersRef.current.push(marker);

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
              }
            });

            // 调整地图视野以显示所有标记
            if (markersRef.current.length > 0) {
              const bounds = new AMap.Bounds();
              markersRef.current.forEach(marker => {
                bounds.extend(marker.getPosition());
              });
              mapInstance.current.setBounds(bounds, true);
            }
          }
        })
        .catch((e: any) => {
          console.error('地图加载失败:', e);
        });
    }

    return () => {
      // 销毁地图实例
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [shops, loading]);

  return (
    <div className="map-page" style={{ padding: 20 }}>
      <Title level={2}>商铺地图显示</Title>
      
      <Card style={{ marginBottom: 20 }}>
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: 600, 
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