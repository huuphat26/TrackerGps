import Svg, { Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const EyeActive = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M0.666748 8.00002C0.666748 8.00002 3.33341 2.66669 8.00008 2.66669C12.6667 2.66669 15.3334 8.00002 15.3334 8.00002C15.3334 8.00002 12.6667 13.3334 8.00008 13.3334C3.33341 13.3334 0.666748 8.00002 0.666748 8.00002Z"
      stroke={props.fill ?? '#686868'} 
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
     fillOpacity={0}/>
    <Path
      d="M8.00008 10C9.10465 10 10.0001 9.10459 10.0001 8.00002C10.0001 6.89545 9.10465 6.00002 8.00008 6.00002C6.89551 6.00002 6.00008 6.89545 6.00008 8.00002C6.00008 9.10459 6.89551 10 8.00008 10Z"
      stroke={props.fill ?? '#686868'} 
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
     fillOpacity={0}/>
  </Svg>
)
export default EyeActive
