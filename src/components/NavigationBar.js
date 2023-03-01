import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import LoadingIndicator from './LoadingIndicator';

export default function NavigationBar({navigation, options, back}) {
  const {title, onTitlePress, headerRight, isFetching} = options;

  return (
    <Appbar.Header elevated>
      {back && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          accessibilityLabel="Go back"
        />
      )}
      <Appbar.Content
        title={title}
        testID="navigation-bar-title"
        onPress={onTitlePress}
      />
      {isFetching && <LoadingIndicator style={styles.navBarLoadingIndicator} />}
      {headerRight?.()}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  navBarLoadingIndicator: {
    marginRight: 8,
  },
});
