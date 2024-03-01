import { Race, Racer, Category } from './Database';
import { Results, ServerSettings } from './Schema';

export interface SettingsState {
  settings: ServerSettings;
  isSubmitting: boolean;
}

export interface RaceInfoState {
  categoryList: Category[];
  racerList: Racer[];
}

export interface ListState {
  raceList: Race[];
  selectedRace: string;
}

export interface ResultState {
  results: Results;
}
