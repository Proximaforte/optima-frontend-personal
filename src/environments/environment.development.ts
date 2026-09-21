import { sharedEnvironment } from './environment.shared';

export const environment = {
  production: false,
  baseUrl: 'https://staging-api.optima.com.ng',
  dojahWidgetId: '6ab11fc75a338ba279b2d268',
  websocketUrl: 'https://staging-api.optima.com.ng/wss',
  ...sharedEnvironment,
};
