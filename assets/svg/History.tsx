import Svg, { Circle, Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const History = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={9} stroke={props.fill ?? 'white'}  strokeWidth={2}  fillOpacity={0}/>
    <Path
      d="M12 7V12L15 15"
      stroke={props.fill ?? 'white'} 
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
     fillOpacity={0}/>
  </Svg>
)
export default History
