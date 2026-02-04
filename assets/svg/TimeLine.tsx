import Svg, { Path, Circle } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const TimeLine = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4"
      stroke={props.fill ?? 'currentColor'} 
      strokeWidth={2}
      strokeLinecap="round"
     fillOpacity={0}/>
    <Path d="M12 4L14 2M12 4L10 2" stroke={props.fill ?? 'currentColor'}  strokeWidth={2} strokeLinecap="round"  fillOpacity={0}/>
    <Path
      d="M8 12L11 15L16 9"
      stroke={props.fill ?? 'currentColor'} 
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
     fillOpacity={0}/>
    <Circle cx={12} cy={4} r={2} fill={props.fill ?? 'currentColor'}  />
  </Svg>
)
export default TimeLine
