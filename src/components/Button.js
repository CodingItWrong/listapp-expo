import {Button as PaperButton} from 'react-native-paper';

export default function Button({
  icon,
  onPress,
  disabled,
  children,
  mode = 'default',
  style,
  testID,
}) {
  const paperMode = MODE_MAP[mode];
  return (
    <PaperButton
      icon={icon}
      mode={paperMode}
      onPress={onPress}
      disabled={disabled}
      style={style}
      testID={testID}
    >
      {children}
    </PaperButton>
  );
}

const MODE_MAP = {
  primary: 'contained',
  link: 'text',
  default: 'outlined',
};
