import { contextBridge } from 'electron';
import SettingsAPI from 'repositories/SettingsRepository';

// eslint-disable-next-line import/prefer-default-export
export const API = {
  settingsAPI: SettingsAPI,
};

contextBridge.exposeInMainWorld('api', API);
