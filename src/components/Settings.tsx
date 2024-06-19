import React, { useState } from 'react';
import { Alert, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { SettingsState, SnackbarState } from 'interfaces/State';
import axios from 'config/AxiosConfig';

function Settings(): React.JSX.Element {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    isOpen: false,
    severity: 'success',
    message: '',
  });
  const [settingsState, setSettingsState] = useState<SettingsState>({
    settings: window.api.settingsAPI.getSettings(),
    isSubmitting: false,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSettingsState({ ...settingsState, isSubmitting: true });
    // TODO: better storing of server credentials?

    window.api.settingsAPI.saveSettings(settingsState.settings);

    axios
      .post(`/settings/database`, {
        url: settingsState.settings.address,
        port: settingsState.settings.port,
        name: settingsState.settings.database,
        username: settingsState.settings.username,
        password: settingsState.settings.password,
      })
      .then((res) => {
        setSettingsState({ ...settingsState, isSubmitting: false });
        setSnackbarState({
          isOpen: true,
          severity: 'success',
          message: 'Database settings successfully updated!',
        });
        return res;
      })
      .catch((err) => {
        let errorMessage = '';
        switch (err.code) {
          case 'ERR_BAD_REQUEST':
            errorMessage = 'Unable to connect to SiTiming database';
            break;
          case 'ERR_NETWORK':
            errorMessage = 'Backend server failed unexpectedly, please restart';
            break;
          default:
            errorMessage = 'Unknown error occurred';
            break;
        }
        setSettingsState({ ...settingsState, isSubmitting: false });
        setSnackbarState({
          isOpen: true,
          severity: 'error',
          message: errorMessage,
        });
      });
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '50vw',
        }}
      >
        <Paper
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
          }}
        >
          <Typography variant="h5" gutterBottom>
            SiTiming Server Settings
          </Typography>
          <TextField
            name="address"
            label="Server IP Address"
            margin="dense"
            value={settingsState.settings.address}
            onChange={(e) => {
              setSettingsState({
                ...settingsState,
                settings: {
                  ...settingsState.settings,
                  address: e.target.value,
                },
              });
            }}
          />
          <TextField
            name="port"
            label="Server Port"
            margin="dense"
            value={settingsState.settings.port}
            onChange={(e) => {
              setSettingsState({
                ...settingsState,
                settings: { ...settingsState.settings, port: e.target.value },
              });
            }}
          />
          <TextField
            name="database"
            label="Database"
            margin="dense"
            value={settingsState.settings.database}
            onChange={(e) => {
              setSettingsState({
                ...settingsState,
                settings: {
                  ...settingsState.settings,
                  database: e.target.value,
                },
              });
            }}
          />
          <TextField
            name="username"
            label="Username"
            margin="dense"
            value={settingsState.settings.username}
            onChange={(e) => {
              setSettingsState({
                ...settingsState,
                settings: {
                  ...settingsState.settings,
                  username: e.target.value,
                },
              });
            }}
          />
          <TextField
            name="password"
            label="Password"
            margin="dense"
            value={settingsState.settings.password}
            onChange={(e) => {
              setSettingsState({
                ...settingsState,
                settings: {
                  ...settingsState.settings,
                  password: e.target.value,
                },
              });
            }}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            startIcon={<Save />}
            loading={settingsState.isSubmitting}
            style={{
              marginTop: '10px',
            }}
          >
            Save
          </LoadingButton>
        </Paper>
      </form>
      <Snackbar
        open={snackbarState.isOpen}
        onClose={() => setSnackbarState({ ...snackbarState, isOpen: false })}
        autoHideDuration={5000}
      >
        <Alert variant="filled" severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Settings;
