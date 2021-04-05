/// <reference types="react-scripts" />

declare module 'jsoneditor-react' {
  export interface JsonEditorProps {
    value: unknown;
    onChange?: (value: unknown) => void;
    htmlElementProps?: React.HTMLAttributes<HTMLTextAreaElement>;
    ace?: unknown;
    theme?: string;
    mode?: 'tree' | 'view' | 'form' | 'code' | 'text';
  }
  export const JsonEditor: React.FC<JsonEditorProps>;
}
