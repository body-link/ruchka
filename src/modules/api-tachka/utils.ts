import { ITokenPayload } from './types/token';

export class AuthError extends Error {}

export const isAuthError = (error: unknown) => error instanceof AuthError;

export const getTokenPayload = (token: string): ITokenPayload =>
  JSON.parse(window.atob(token.split('.')[1]));
