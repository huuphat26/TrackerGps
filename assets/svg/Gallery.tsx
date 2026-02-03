import Svg, { Rect, Circle, Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Gallery = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect x={4} y={5} width={16} height={14} rx={2} stroke={props.fill ?? '#8E8E93'}  strokeWidth={2}  fillOpacity={0}/>
    <Circle cx={8.5} cy={8.5} r={1.5} fill={props.fill ?? '#8E8E93'}  />
    <Path
      d="M20 15L16 11L13 14L11 12L4 19"
      stroke={props.fill ?? '#8E8E93'} 
      strokeWidth={2}
      strokeLinejoin="round"
     fillOpacity={0}/>
  </Svg>
)
export default Gallery
