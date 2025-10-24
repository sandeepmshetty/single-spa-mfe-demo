import { onErrorCaptured, ref } from 'vue';
import { errorLogger } from '@single-spa-demo/shared-library';

export function useErrorHandler(mfeName = 'vue-mfe') {
  const error = ref<Error | null>(null);
  const hasError = ref(false);

  onErrorCaptured((err: Error, instance, info) => {
    error.value = err;
    hasError.value = true;

    errorLogger.logError(err, mfeName, 'critical', {
      componentInfo: info,
      instance: instance?.$options.name,
    });

    return false;
  });

  const resetError = () => {
    error.value = null;
    hasError.value = false;
  };

  return {
    error,
    hasError,
    resetError,
  };
}
