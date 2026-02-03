import Svg, { Circle, Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Car = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 64 76" fill="none" {...props}>
    <Circle cx={32} cy={32} r={30} stroke={props.fill ?? '#1D72E8'}  strokeWidth={4} strokeOpacity={0.3}  fillOpacity={0}/>
    <Circle cx={32} cy={32} r={26} fill={props.fill ?? '#1D72E8'}  />
    <Path d="M32 76L22.4737 59.5H41.5263L32 76Z" fill={props.fill ?? '#1D72E8'}  />
    <Path
      d="M46 39V42C46 42.5523 45.5523 43 45 43H43C42.4477 43 42 42.5523 42 42V41H22V42C22 42.5523 21.5523 43 21 43H19C18.4477 43 18 42.5523 18 42V39L19.4552 32.4517C19.7909 30.9411 21.1274 29.8571 22.6744 29.8571H41.3256C42.8726 29.8571 44.2091 30.9411 44.5448 32.4517L46 39Z"
      fill={props.fill ?? 'white'} 
    />
    <Path
      d="M19 39H45L43.8 33.6C43.5 32.25 42.3 31.35 40.9 31.35H23.1C21.7 31.35 20.5 32.25 20.2 33.6L19 39Z"
      fill={props.fill ?? 'white'} 
    />
    <Circle cx={23.5} cy={39.5} r={2.5} fill={props.fill ?? '#1D72E8'}  />
    <Circle cx={40.5} cy={39.5} r={2.5} fill={props.fill ?? '#1D72E8'}  />
  </Svg>
)
export default Car
