import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Modal, Button } from '@douyinfe/semi-ui';

interface MapSelectorProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (latitude: number, longitude: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  visible,
  onCancel,
  onConfirm,
  initialLatitude = 31.961087,
  initialLongitude = 118.881044,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ latitude: number; longitude: number }>({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  useEffect(() => {
    if (visible && mapRef.current) {
      AMapLoader.load({
        key: '5131350db8ad49230fd4c7f3cab4f1d8', // 请替换为您的高德地图API密钥
        version: '2.0',
        plugins: ['AMap.ToolBar', 'AMap.Scale'],
      })
        .then((AMap: any) => {
          // 创建地图实例
          mapInstance.current = new AMap.Map(mapRef.current, {
            viewMode: '3D',
            zoom: 13,
            center: [initialLongitude, initialLatitude],
          });

          // 添加工具条和比例尺
          mapInstance.current.addControl(new AMap.ToolBar());
          mapInstance.current.addControl(new AMap.Scale());

          // 创建标记
          markerInstance.current = new AMap.Marker({
            position: [initialLongitude, initialLatitude],
            draggable: true,
          });

          // 添加标记到地图
          markerInstance.current.setMap(mapInstance.current);

          // 监听地图点击事件
          mapInstance.current.on('click', (e: any) => {
            const lnglat = e.lnglat;
            setSelectedPosition({
              latitude: lnglat.getLat(),
              longitude: lnglat.getLng(),
            });

            // 更新标记位置
            markerInstance.current.setPosition([lnglat.getLng(), lnglat.getLat()]);
          });

          // 监听标记拖动事件
          markerInstance.current.on('dragend', (e: any) => {
            const lnglat = e.lnglat;
            setSelectedPosition({
              latitude: lnglat.getLat(),
              longitude: lnglat.getLng(),
            });
          });
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
  }, [visible, initialLatitude, initialLongitude]);

  const handleConfirm = () => {
    onConfirm(selectedPosition.latitude, selectedPosition.longitude);
  };

  return (
    <Modal
      title="选择位置"
      visible={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      okButtonProps={{ type: 'primary' }}
      width={900}
      height={600}
    >
      <div style={{ height: '400px', width: '100%' }} ref={mapRef} />
      <div style={{ marginTop: '16px', fontSize: '14px' }}>
        选择的位置：
        <span style={{ marginLeft: '8px' }}>
          纬度: {selectedPosition.latitude.toFixed(6)},
          经度: {selectedPosition.longitude.toFixed(6)}
        </span>
      </div>
    </Modal>
  );
};

export default MapSelector;