import React from 'react';
import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import { useForkRef } from '../../supply/react-helpers';
import { isDefined } from '../../supply/type-guards';

interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange: (value: string) => void;
  initialValue?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const JSField = React.memo<IProps>(
  React.forwardRef<HTMLDivElement, IProps>(function JSField(
    { initialValue, onChange, style, ...rest },
    outerRef
  ) {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const ref = useForkRef(outerRef, innerRef);

    const memo = React.useMemo(() => {
      const el = document.createElement('div');
      const editor = ace.edit(el);
      editor.getSession().setMode('ace/mode/javascript');
      editor.setTheme('ace/theme/monokai');
      if (isDefined(initialValue)) {
        editor.setValue(initialValue, 1);
      }
      return {
        el,
        editor,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      innerRef.current?.appendChild(memo.el);
    }, [memo]);

    React.useEffect(() => {
      const handler = () => onChange(memo.editor.getValue());
      memo.editor.on('input', handler);
      return () => memo.editor.off('input', handler);
    }, [memo, onChange]);

    return <div {...rest} ref={ref} style={{ display: 'grid', minHeight: 150, ...style }} />;
  })
);
