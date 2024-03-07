import React, { useState, useEffect } from 'react';
import { Refresh } from '@mui/icons-material';
import {
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { RaceInfoState, ListState, ResultState } from 'interfaces/State';
import { Racer, Category } from 'interfaces/Database';
import {
  getListStateFromStorage,
  getRaceInfoStateFromStorage,
  getResultStateFromStorage,
  setListStateInStorage,
  setRaceInfoStateInStorage,
  setResultStateInStorage,
} from 'services/LocalStorageService';
import getStageTimesByCardNumber from 'services/LeaderboardService';
import RaceStatus from './RaceStatus';
import RaceLeaderboard from './RaceLeaderboard';

function RaceHome(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState('status');

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [raceInfoState, setRaceInfoState] = useState<RaceInfoState>({
    categoryList: [],
    racerList: [],
  });

  const [listState, setListState] = useState<ListState>({
    raceList: [],
    selectedRace: '',
  });

  const [resultState, setResultState] = useState<ResultState>({
    results: {},
  });

  // on component mount
  useEffect(() => {
    const raceInfoStateJson = getRaceInfoStateFromStorage();
    const listStateJson = getListStateFromStorage();
    const resultStateJson = getResultStateFromStorage();

    setRaceInfoState(raceInfoStateJson);
    setListState(listStateJson);
    setResultState(resultStateJson);

    if (listStateJson.selectedRace !== '') {
      getStageTimesByCardNumber(listStateJson.selectedRace)
        .then((res) => {
          return setResultState({ results: res });
        })
        .catch((err) => {
          throw err;
        });
    }
  }, []);

  // whenever race state is updated
  useEffect(() => {
    setRaceInfoStateInStorage(raceInfoState);
  }, [raceInfoState]);

  useEffect(() => {
    setListStateInStorage(listState);
  }, [listState]);

  useEffect(() => {
    setResultStateInStorage(resultState);
  }, [resultState]);

  function generateCatList(raceId: string) {
    const promises = [
      fetch(`http://localhost:8085/api/categories?raceId=${raceId}`).then(
        (res) => res.json(),
      ),
      fetch(`http://localhost:8085/api/racers?raceId=${raceId}`).then((res) =>
        res.json(),
      ),
    ];

    Promise.all(promises)
      .then((data) => {
        const categoryList = (data[0] as Category[]).sort((a, b) => {
          if (a.numRacers === 0 && b.numRacers === 0) return 0;
          if (a.numRacers === 0) return 1;
          if (b.numRacers === 0) return -1;

          return 0;
        });

        const newState = {
          categoryList,
          racerList: data[1] as Racer[],
        };

        return setRaceInfoState(newState);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getRaces() {
    fetch(`http://localhost:8085/api/races`)
      .then((res) => res.json())
      .then((res) => {
        setIsRefreshing(false);
        setListState({ ...listState, raceList: res });

        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  function handleRaceSelect(event: SelectChangeEvent) {
    const selectedRace = event.target.value;

    setListState({ ...listState, selectedRace });

    getStageTimesByCardNumber(selectedRace)
      .then((times) => {
        return setResultState({ results: times });
      })
      .catch((err) => {
        throw err;
      });

    generateCatList(selectedRace);
  }

  function handleRefresh() {
    const { selectedRace } = listState;

    setIsRefreshing(true);
    getRaces();

    if (selectedRace !== '') {
      generateCatList(selectedRace);
    }
  }

  return (
    <div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <FormControl variant="filled" fullWidth>
          <InputLabel id="raceInputLabel">Select Race</InputLabel>
          <Select
            value={listState.selectedRace}
            onChange={(e) => {
              handleRaceSelect(e);
            }}
            onOpen={() => {
              getRaces();
            }}
            labelId="raceInputLabel"
            label="Select Race"
            style={{
              height: '50px',
              width: '100%',
              backgroundColor: 'white',
            }}
          >
            {listState.raceList.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          variant="contained"
          onClick={() => {
            handleRefresh();
          }}
          startIcon={<Refresh />}
          loading={isRefreshing}
          style={{
            marginLeft: '10px',
          }}
        >
          Refresh
        </LoadingButton>
      </Box>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(event, newValue) => {
              setTabValue(newValue);
            }}
          >
            <Tab label="Status" value="status" />
            <Tab label="Leaderboard" value="leaderboard" />
          </TabList>
        </Box>
        <TabPanel value="status">
          <RaceStatus raceInfoState={raceInfoState} listState={listState} />
        </TabPanel>
        <TabPanel value="leaderboard">
          <RaceLeaderboard
            raceInfoState={raceInfoState}
            resultsState={resultState}
          />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default RaceHome;
