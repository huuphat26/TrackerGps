import Svg, { Circle, Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Map = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={3} fill={props.fill ?? 'currentColor'}  />
    <Path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3"
      stroke={props.fill ?? 'currentColor'} 
      strokeWidth={2}
      strokeLinecap="round"
     fillOpacity={0}/>
    <Path
      d="M12 18C15.3137 18 18 15.3137 18 12"
      stroke={props.fill ?? 'currentColor'} 
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeDasharray="2 2"
     fillOpacity={0}/>
    <Path
      d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17"
      stroke={props.fill ?? 'currentColor'} 
      strokeWidth={2}
      strokeLinecap="round"
     fillOpacity={0}/>
  </Svg>
)
export default Map
