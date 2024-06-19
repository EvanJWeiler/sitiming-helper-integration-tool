import { ListState } from 'interfaces/State';

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

export const getTabStateFromStorage = (): string => {
  let tabState = window.sessionStorage.getItem('tabState') as string;

  if (!tabState) {
    tabState = 'status';
  }

  return tabState;
};

export const setTabStateInStorage = (tabState: string) => {
  window.sessionStorage.setItem('tabState', tabState);
};
