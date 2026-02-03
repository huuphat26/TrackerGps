// ⚠️ Auto-generated — DO NOT EDIT

import Camera from './Camera';
import Car from './Car';
import Devices from './Devices';
import Gallery from './Gallery';
import History from './History';
import Map from './Map';
import Setting from './Setting';

export const SvgType = {
  Camera: Camera,
  Car: Car,
  Devices: Devices,
  Gallery: Gallery,
  History: History,
  Map: Map,
  Setting: Setting,
} as const;

export type ISvgType = keyof typeof SvgType;

export default SvgType;
