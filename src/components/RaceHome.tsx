import React, { useEffect, useState } from 'react';
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
import { ListState } from 'interfaces/State';
import axios from 'config/AxiosConfig';
import {
  getListStateFromStorage,
  getTabStateFromStorage,
  setListStateInStorage,
  setTabStateInStorage,
} from 'services/LocalStorageService';
import RaceStatus from './RaceStatus';
import RaceLeaderboard from './RaceLeaderboard';

function RaceHome(): React.JSX.Element {
  const [tabState, setTabState] = useState(getTabStateFromStorage());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>(
    getListStateFromStorage(),
  );

  const getRaceList = () => {
    axios
      .get('/races')
      .then((res) => {
        setListState({ ...listState, raceList: res.data });
        setIsRefreshing(false);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  function handleRaceSelect(event: SelectChangeEvent) {
    const selectedRace = event.target.value;

    setListState({ ...listState, selectedRace });
  }

  function handleRefresh() {
    setIsRefreshing(true);

    // refresh by setting list state to empty list and dummy uuid, then re-fetch
    setListState({
      raceList: [],
      selectedRace: 'c5f410d8-c549-4c79-a56e-702943b73f02',
    });

    getRaceList();
  }

  useEffect(() => {
    setListStateInStorage(listState);
  }, [listState]);

  useEffect(() => {
    setTabStateInStorage(tabState);
  }, [tabState]);

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
              getRaceList();
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
      <TabContext value={tabState}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(event, newValue) => {
              setTabState(newValue);
            }}
          >
            <Tab label="Status" value="status" />
            <Tab label="Leaderboard" value="leaderboard" />
          </TabList>
        </Box>
        <TabPanel value="status">
          <RaceStatus raceId={listState.selectedRace} />
        </TabPanel>
        <TabPanel value="leaderboard">
          <RaceLeaderboard raceId={listState.selectedRace} />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default RaceHome;
