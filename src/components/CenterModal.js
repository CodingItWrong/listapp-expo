import {Pressable, StyleSheet, View} from 'react-native';

export default function CenterModal({children, onDismiss}) {
  return (
    <View style={styles.columnWrapper}>
      <PressableArea onPress={onDismiss} />
      <View style={styles.column}>
        <PressableArea onPress={onDismiss} />
        {children}
        <PressableArea onPress={onDismiss} />
      </View>
      <PressableArea onPress={onDismiss} />
    </View>
  );
}

function PressableArea({onPress}) {
  return <Pressable onPress={onPress} style={styles.pressableArea} />;
}

// LARGE will be given most of the space first, but after it meets its max width, SMALL will still grow
const VERY_LARGE_GROW = 100;
const VERY_SMALL_GROW = 1;

const styles = StyleSheet.create({
  columnWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    maxWidth: 640, // fits sub-12.9 ipad portrait and half high-res 13" screen
    flexGrow: VERY_LARGE_GROW,
  },
  pressableArea: {
    flexGrow: VERY_SMALL_GROW,
  },
});
