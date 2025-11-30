import { WMSLayerConfig } from '@/types/map.types';

export const WMS_SERVICE_URL = 'https://www.wms.nrw.de/geobasis/wms_nw_dop';

export const wmsConfig: WMSLayerConfig = {
  layers: 'nw_dop',
  format: 'image/png',
  transparent: true,
  version: '1.1.1' 
};

export const getWMSLayerParams = () => ({
  layers: wmsConfig.layers,
  format: wmsConfig.format,
  transparent: wmsConfig.transparent,
  version: wmsConfig.version,
  srs: 'EPSG:3857', 
  styles: ''
});

export const getWMSLayerParams130 = () => ({
  layers: wmsConfig.layers,
  format: wmsConfig.format,
  transparent: wmsConfig.transparent,
  version: '1.3.0',
  crs: 'EPSG:3857',
  styles: ''
});