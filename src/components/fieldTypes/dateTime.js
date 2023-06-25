import {Suspense, lazy} from 'react';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateTimeUtils from '../../utils/dateTimeUtils';

const LazyDateEditorComponent = lazy(() =>
  import('./lazy/DateEditorComponent'),
);

const dateTimeFieldDataType = {
  key: FIELD_DATA_TYPES.DATETIME.key,
  label: 'Date and Time',
  isTemporal: true,
  isValidValue: value => !!dateTimeUtils.serverStringToObject(value),
  formatValue: ({value}) => dateTimeUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // datetimes are stored as strings that sort lexicographically
  EditorComponent: DateTimeEditorComponent,
};

function DateTimeEditorComponent(props) {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <LazyDateEditorComponent {...props} />
    </Suspense>
  );
}

export default dateTimeFieldDataType;
