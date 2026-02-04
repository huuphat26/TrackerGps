// ⚠️ Auto-generated — DO NOT EDIT

import Camera from './Camera';
import Car from './Car';
import Devices from './Devices';
import EyeActive from './EyeActive';
import EyeOff from './EyeOff';
import Gallery from './Gallery';
import History from './History';
import Map from './Map';
import NumPad from './NumPad';
import Setting from './Setting';
import TimeLine from './TimeLine';
import User from './User';

export const SvgType = {
  Camera: Camera,
  Car: Car,
  Devices: Devices,
  EyeActive: EyeActive,
  EyeOff: EyeOff,
  Gallery: Gallery,
  History: History,
  Map: Map,
  NumPad: NumPad,
  Setting: Setting,
  TimeLine: TimeLine,
  User: User,
} as const;

export type ISvgType = keyof typeof SvgType;

export default SvgType;
