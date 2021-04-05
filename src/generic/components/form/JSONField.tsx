import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import React from 'react';
import { JsonEditor, JsonEditorProps } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

export const JSONField: React.FC<JsonEditorProps> = (props) => (
  <JsonEditor {...props} theme="ace/theme/github" />
);
