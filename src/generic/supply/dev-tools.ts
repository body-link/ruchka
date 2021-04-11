import { isDevelopment } from './env-helpers';
import { signalDebug } from 'rxjs-signal';

if (isDevelopment) {
  signalDebug();
}
