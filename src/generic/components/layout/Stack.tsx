import * as React from 'react';
import { RaThemeOptions } from 'react-admin';
import { Box, BoxProps } from '@material-ui/core';
import { CreateCSSProperties, makeStyles } from '@material-ui/styles';
import { isFunction, isNumber } from '../../supply/type-guards';

interface IStyleProps {
  isInline: boolean;
  isCentered: boolean;
  isMiddled: boolean;
  spacing: number | string;
}

interface IProps extends Partial<IStyleProps>, React.HTMLAttributes<HTMLDivElement> {}

const useStyles = makeStyles<RaThemeOptions, IStyleProps, 'root'>((theme) => ({
  root: (props) => {
    const spacing =
      isNumber(props.spacing) && props.spacing > 0 && isFunction(theme.spacing)
        ? `${theme.spacing(props.spacing)}px`
        : props.spacing;
    const baseStyle: CreateCSSProperties<IStyleProps> = props.isInline
      ? {
          '&>*': {
            marginRight: important(spacing),
          },
          '&>*:last-child': {
            marginRight: important(0),
          },
        }
      : {
          flexDirection: 'column',
          '&>*': {
            marginBottom: important(spacing),
          },
          '&>*:last-child': {
            marginBottom: important(0),
          },
        };
    if (props.isMiddled || props.isCentered) {
      baseStyle.alignItems = 'center';
    }
    if (props.isMiddled) {
      baseStyle.justifyContent = 'center';
    }
    baseStyle.display = 'flex';
    return baseStyle;
  },
}));

export const Stack = React.forwardRef<HTMLDivElement, IProps & BoxProps>(
  ({ isInline = false, isCentered = false, isMiddled = false, spacing = 0, ...rest }, ref) => {
    const style = useStyles({ isInline, isCentered, isMiddled, spacing });
    return <Box {...{ ...rest, ref }} className={style.root} />;
  }
);

const important = (val: string | number) => `${val}!important`;
