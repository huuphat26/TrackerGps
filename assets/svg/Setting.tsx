import Svg, { Path, Circle } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Setting = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M4 12H10M14 12H20" stroke={props.fill ?? 'currentColor'}  strokeWidth={2} strokeLinecap="round"  fillOpacity={0}/>
    <Circle cx={12} cy={12} r={3} stroke={props.fill ?? 'currentColor'}  strokeWidth={2}  fillOpacity={0}/>
    <Path d="M4 6H14M18 6H20" stroke={props.fill ?? 'currentColor'}  strokeWidth={2} strokeLinecap="round"  fillOpacity={0}/>
    <Circle cx={16} cy={6} r={2} fill={props.fill ?? 'currentColor'}  />
    <Path d="M4 18H6M10 18H20" stroke={props.fill ?? 'currentColor'}  strokeWidth={2} strokeLinecap="round"  fillOpacity={0}/>
    <Circle cx={8} cy={18} r={2} fill={props.fill ?? 'currentColor'}  />
  </Svg>
)
export default Setting
