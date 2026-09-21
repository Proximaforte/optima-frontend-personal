import { sharedEnvironment } from './environment.shared';

export const environment = {
  production: true,
  baseUrl: 'https://api.optima.com.ng',
  dojahWidgetId: '6a5101c560b6226d1777bef6',
  websocketUrl: 'https://api.optima.com.ng/wss',
  ...sharedEnvironment,
};
