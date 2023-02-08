import {StyleSheet, useWindowDimensions} from 'react-native';
import {large, useBreakpoint} from '../breakpoints';

const sharedStyles = StyleSheet.create({
  columnPadding: {
    padding: 8,
  },
  fill: {
    flex: 1,
  },
  fullHeight: {
    flex: 1,
  },
  mb: {
    marginBottom: 8,
  },
  mt: {
    marginTop: 8,
  },
  noPadding: {
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    // causes label overlap issues on web
    // backgroundColor: 'transparent',
    // paddingHorizontal: 0,
  },
});

export default sharedStyles;

export function useColumnStyle() {
  const breakpoint = useBreakpoint();
  const {width: viewportWidth} = useWindowDimensions();

  return {
    width: breakpoint === large ? 400 : viewportWidth,
    padding: 8,
  };
}
