import React, { useEffect, useState } from 'react';
import { ExpandMoreSharp } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { RaceStatusColumns } from 'interfaces/ColumnDefinitions';
import { validate as uuidValidate } from 'uuid';
import { CategoryWithStatus, RaceInfo, RacerStatus } from 'interfaces/Database';
import { getCategoryStatus, getCategoryStatusString } from 'util/StatusUtil';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'config/AxiosConfig';
import CategoryStatus from './CategoryStatus';

interface RaceStatusProps {
  raceId: string;
}

function RaceStatus({ raceId }: RaceStatusProps): React.JSX.Element {
  const [racerList, setRacerList] = useState<Array<RacerStatus>>([]);
  const [categoryList, setCategoryList] = useState<Array<CategoryWithStatus>>(
    [],
  );
  const [raceInfo, setRaceInfo] = useState<RaceInfo>({
    id: '',
    name: '',
    totalRacers: 0,
    racersOnCourse: 0,
  });

  useEffect(() => {
    const getRacerList = () => {
      axios
        .get(`/racers/status?raceId=${raceId}`)
        .then((res) => {
          setRacerList(res.data);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    };

    const getCategoryList = () => {
      axios
        .get(`/categories/status?raceId=${raceId}`)
        .then((res) => {
          setCategoryList(res.data);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    };

    const getRaceInfo = () => {
      axios
        .get(`/races/info?raceId=${raceId}`)
        .then((res) => {
          setRaceInfo(res.data);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    };

    if (uuidValidate(raceId)) {
      getRacerList();
      getCategoryList();
      getRaceInfo();
    }
  }, [raceId]);

  return (
    <div>
      {categoryList.length !== 0 && (
        <List>
          <Accordion
            key={raceId}
            disableGutters
            square
            slotProps={{ transition: { unmountOnExit: true } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
              <Box
                style={getCategoryStatus(
                  raceInfo.totalRacers,
                  raceInfo.racersOnCourse,
                )}
              />
              <Typography>{raceInfo.name}</Typography>
              <Chip
                variant="outlined"
                label={getCategoryStatusString(
                  raceInfo.totalRacers,
                  raceInfo.racersOnCourse,
                )}
                style={{
                  height: '25px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <DataGrid
                density="compact"
                disableRowSelectionOnClick
                autoHeight
                initialState={{
                  pagination: { paginationModel: { pageSize: 15 } },
                }}
                pageSizeOptions={[15, 25, 50]}
                rows={racerList}
                columns={RaceStatusColumns}
              />
            </AccordionDetails>
          </Accordion>
          <Divider />
          {categoryList.map((category) => (
            <div key={category.id}>
              <CategoryStatus raceId={raceId} category={category} />
            </div>
          ))}
        </List>
      )}
    </div>
  );
}

export default RaceStatus;
