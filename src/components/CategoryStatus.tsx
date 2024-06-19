import React, { useEffect, useState } from 'react';
import { CategoryWithStatus, RacerStatus } from 'interfaces/Database';
import { DataGrid } from '@mui/x-data-grid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { ExpandMoreSharp } from '@mui/icons-material';
import { CategoryStatusColumns } from 'interfaces/ColumnDefinitions';
import { getCategoryStatus, getCategoryStatusString } from 'util/StatusUtil';
import axios from 'config/AxiosConfig';

interface CategoryDetailProps {
  raceId: string;
  category: CategoryWithStatus;
}

function CategoryStatus({
  raceId,
  category,
}: CategoryDetailProps): React.JSX.Element {
  const [racerList, setRacerList] = useState<Array<RacerStatus>>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const getRacerStatusList = () => {
      axios
        .get(`/racers/status?raceId=${raceId}&categoryId=${category.id}`)
        .then((res) => {
          setRacerList(res.data);
          setIsLoaded(true);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    };

    getRacerStatusList();
  }, [raceId, category]);

  return (
    <div>
      {/* TODO: accordion stays open when clicked before being disabled */}
      <Accordion
        disableGutters
        square
        slotProps={{ transition: { unmountOnExit: true } }}
        disabled={isLoaded && racerList.length === 0}
      >
        <AccordionSummary
          expandIcon={
            isLoaded ? <ExpandMoreSharp /> : <CircularProgress size="1.5rem" />
          }
        >
          <Box
            style={getCategoryStatus(
              category.totalRacers,
              category.racersOnCourse,
            )}
          />
          <Typography>{category.name}</Typography>
          <Chip
            variant="outlined"
            label={getCategoryStatusString(
              category.totalRacers,
              category.racersOnCourse,
            )}
            style={{
              height: '25px',
              marginLeft: '10px',
            }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {!isLoaded && <CircularProgress size="2rem" />}
          {isLoaded && (
            <DataGrid
              density="compact"
              disableRowSelectionOnClick
              autoHeight
              initialState={{
                pagination: { paginationModel: { pageSize: 15 } },
              }}
              pageSizeOptions={[15, 25, 50]}
              rows={racerList}
              columns={CategoryStatusColumns}
            />
          )}
        </AccordionDetails>
      </Accordion>
      <Divider />
    </div>
  );
}

export default CategoryStatus;
