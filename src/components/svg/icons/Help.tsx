import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function HelpIcon(props: IconProps) {
  const { color = COLORS.neutral900, scale = 1 } = props;

  return (
    <Svg width={25 * scale} height={25 * scale} fill="none" {...props}>
      <Path
        fill={color}
        d="M12.5 2.982c5.523 0 10 4.478 10 10s-4.477 10-10 10-10-4.478-10-10 4.477-10 10-10Zm0 13.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0-8.75a2.75 2.75 0 0 0-2.75 2.75.75.75 0 0 0 1.493.102l.007-.102a1.25 1.25 0 1 1 2.5 0c0 .54-.135.806-.645 1.333l-.135.137c-.878.878-1.22 1.447-1.22 2.53a.75.75 0 0 0 1.5 0c0-.538.135-.805.645-1.332l.135-.137c.878-.878 1.22-1.448 1.22-2.53a2.75 2.75 0 0 0-2.75-2.75Z"
      />
    </Svg>
  );
}
