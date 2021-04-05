import * as React from 'react';
import { Login, useLogin, useNotify, useTranslate } from 'react-admin';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { isError, isText } from '../../generic/supply/type-guards';
import { Stack } from '../../generic/components/layout/Stack';
import { tachka } from '../shell/tachkaClient';

export const PageLogin = () => {
  const [url, setUrl] = React.useState(tachka.endpoint ?? '');
  const [secret, setSecret] = React.useState(
    "This secret from .env file won't work on production. Change it after deploy"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsLoading(true);
    login({ url, secret })
      .catch((err) => notify(isError(err) ? err.message : 'ra.auth.sign_in_error', 'warning'))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Login>
      <form onSubmit={submit}>
        <Stack spacing={2} p={2}>
          <TextField
            fullWidth
            label="Tachka URL"
            variant="outlined"
            type="url"
            autoFocus
            value={url}
            disabled={isLoading}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            fullWidth
            label="Secret"
            variant="outlined"
            type="string"
            value={secret}
            disabled={isLoading}
            onChange={(e) => setSecret(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            disabled={!isText(url.trim()) || !isText(secret.trim()) || isLoading}
          >
            {isLoading && (
              <CircularProgress size={18} thickness={2} style={{ marginRight: '1em' }} />
            )}
            {translate('ra.auth.sign_in')}
          </Button>
        </Stack>
      </form>
    </Login>
  );
};
