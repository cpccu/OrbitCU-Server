type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const formatMessage = (level: LogLevel, message: string, ...optionalParams: any[]) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

export const logger = {
  info: (message: string, ...optionalParams: any[]) => {
    console.log(formatMessage('info', message), ...optionalParams);
  },
  warn: (message: string, ...optionalParams: any[]) => {
    console.warn(formatMessage('warn', message), ...optionalParams);
  },
  error: (message: string, ...optionalParams: any[]) => {
    console.error(formatMessage('error', message), ...optionalParams);
  },
  debug: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message), ...optionalParams);
    }
  }
};
