import React from 'react';
import { JsonEditorProps } from 'jsoneditor-react';
import { JSONField } from './JSONField';

export const JSONView = React.memo<JsonEditorProps>(function JSONView(props) {
  return <JSONField key={JSON.stringify(props)} mode="view" {...props} />;
});
