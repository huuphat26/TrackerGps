import Svg, { Path, Circle } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Camera = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 9C4 7.89543 4.89543 7 6 7H8.5L10 5H14L15.5 7H18C19.1046 7 20 7.89543 20 9V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V9Z"
      stroke={props.fill ?? 'white'} 
      strokeWidth={2}
      strokeLinejoin="round"
     fillOpacity={0}/>
    <Circle cx={12} cy={13} r={3} stroke={props.fill ?? 'white'}  strokeWidth={2}  fillOpacity={0}/>
  </Svg>
)
export default Camera
