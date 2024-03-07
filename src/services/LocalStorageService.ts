import { Racer } from 'interfaces/Database';
import { ListState, RaceInfoState, ResultState } from 'interfaces/State';

export const getRaceInfoStateFromStorage = (): RaceInfoState => {
  let raceInfoStateString = window.sessionStorage.getItem(
    'raceInfoState',
  ) as string;

  if (!raceInfoStateString) {
    raceInfoStateString = JSON.stringify({
      categoryList: [],
      racerMap: new Map<string, Racer[]>(),
    });
  }

  return JSON.parse(raceInfoStateString);
};

export const setRaceInfoStateInStorage = (raceInfoState: RaceInfoState) => {
  window.sessionStorage.setItem('raceInfoState', JSON.stringify(raceInfoState));
};

export const getListStateFromStorage = (): ListState => {
  let listStateString = window.sessionStorage.getItem('listState') as string;

  if (!listStateString) {
    listStateString = JSON.stringify({
      raceList: [],
      selectedRace: '',
    });
  }

  return JSON.parse(listStateString);
};

export const setListStateInStorage = (listState: ListState) => {
  window.sessionStorage.setItem('listState', JSON.stringify(listState));
};

export const getResultStateFromStorage = (): ResultState => {
  let resultStateString = window.sessionStorage.getItem(
    'resultState',
  ) as string;

  if (!resultStateString) {
    resultStateString = JSON.stringify({
      results: {},
    });
  }

  return JSON.parse(resultStateString);
};

export const setResultStateInStorage = (resultState: ResultState) => {
  window.sessionStorage.setItem('resultState', JSON.stringify(resultState));
};
