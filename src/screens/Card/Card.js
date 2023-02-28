import {useNavigation} from '@react-navigation/native';
import {Platform, Pressable, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar} from 'react-native-paper';
import Card from '../../components/Card';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import {useBoard} from '../../data/boards';
import {useCard} from '../../data/cards';
import {useCurrentBoard} from '../../data/currentBoard';
import EditCardForm from '../Board/Card/EditCardForm';

export default function CardScreen({route}) {
  const {boardId} = useCurrentBoard();
  const {cardId} = route.params;
  const navigation = useNavigation();

  const {data: board, isLoading: isLoadingBoard} = useBoard(boardId);
  const {data: card, isLoading: isLoadingCard} = useCard({boardId, cardId});
  const isLoading = isLoadingBoard || isLoadingCard;

  function closeModal() {
    navigation.goBack();
  }

  return (
    <CardWrapper>
      {Platform.OS === 'ios' && (
        <Appbar.BackAction onPress={closeModal} accessibilityLabel="Go back" />
      )}
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          {card && (
            <EditCardForm
              card={card}
              board={board}
              onChange={closeModal}
              onCancel={closeModal}
            />
          )}
        </KeyboardAwareScrollView>
      )}
    </CardWrapper>
  );
}

function CardWrapper({children}) {
  const navigation = useNavigation();
  return Platform.select({
    web: (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
          ]}
          onPress={navigation.goBack}
        />
        <Card style={styles.wrapperCard}>{children}</Card>
      </View>
    ),
    default: <ScreenBackground>{children}</ScreenBackground>,
  });
}

const styles = StyleSheet.create({
  wrapperCard: {
    marginTop: 8,
  },
  container: {
    padding: 16,
  },
});
