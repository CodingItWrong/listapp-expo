import {StyleSheet} from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';

export default function ConfirmationDialog({
  open,
  title,
  message,
  confirmButtonLabel,
  onConfirm,
  onDismiss,
  destructive,
}) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog visible={open} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.button}
            buttonColor={destructive ? theme.colors.error : null}
          >
            {confirmButtonLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
  },
});