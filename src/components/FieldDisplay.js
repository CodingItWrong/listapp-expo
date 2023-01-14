import FIELD_DATA_TYPES from '../fieldDataTypes';
import dateUtils from '../utils/dateUtils';
import Text from './Text';

export default function FieldDisplay({field, value}) {
  switch (field.attributes['data-type']) {
    case FIELD_DATA_TYPES.text:
      return <Text>{value}</Text>;
    case FIELD_DATA_TYPES.date:
      return <Text>{dateUtils.serverStringToHumanString(value)}</Text>;
    default:
      return <Text>ERROR: unknown field data type {field['data-type']}</Text>;
  }
}
