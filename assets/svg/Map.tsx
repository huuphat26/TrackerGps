import Svg, { Polygon, Line } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Map = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.fill ?? 'currentColor'} 
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <Line x1={8} y1={2} x2={8} y2={18} />
    <Line x1={16} y1={6} x2={16} y2={22} />
  </Svg>
)
export default Map
