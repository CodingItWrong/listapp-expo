import {View} from 'react-native';
import {AutoDetectLink} from './AutoDetectLink';
import Text from './Text';
import fieldTypes from './fieldTypes';

export default function Field({
  field,
  value,
  readOnly,
  disabled,
  setValue,
  style,
}) {
  const {name, 'data-type': dataType, options} = field.attributes;

  const fieldType = fieldTypes[dataType];

  if (!fieldType) {
    return <Text>ERROR: unknown data type {dataType}</Text>;
  }

  if (readOnly) {
    let textToShow = fieldType.formatValue({value, options});

    if (!textToShow) {
      return null;
    }

    if (options['show-label-when-read-only']) {
      textToShow = `${name}: ${textToShow ?? '(empty)'}`;
    }

    return (
      <View style={style} testID={`field-${field.id}`}>
        <AutoDetectLink>{textToShow}</AutoDetectLink>
      </View>
    );
  }

  const {EditorComponent} = fieldType;
  return (
    <EditorComponent
      field={field}
      value={value ?? ''}
      setValue={setValue}
      disabled={disabled}
      style={style}
    />
  );
}
