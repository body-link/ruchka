import { generalActionsLog$ } from './action-helpers';
import { isDevelopment } from './env-helpers';

if (isDevelopment) {
  generalActionsLog$.subscribe(({ key, namespace, payload }) => {
    console.group('🔷', key, '🔹', namespace);
    console.log(payload);
    console.groupEnd();
  });
}
