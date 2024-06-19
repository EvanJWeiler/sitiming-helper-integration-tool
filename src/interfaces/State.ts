import { Race, RacerStatus, CategoryWithStatus } from './Database';
import { Results, ServerSettings } from './Schema';

export interface SettingsState {
  settings: ServerSettings;
  isSubmitting: boolean;
}

export interface SnackbarState {
  isOpen: boolean;
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface RaceInfoState {
  categoryList: CategoryWithStatus[];
  racerList: RacerStatus[];
}

export interface ListState {
  raceList: Race[];
  selectedRace: string;
}

export interface ResultState {
  results: Results;
}
