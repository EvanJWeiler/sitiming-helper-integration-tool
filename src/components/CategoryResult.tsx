import React, { useEffect, useState } from 'react';
import { CategoryWithStages, RacerResult } from 'interfaces/Database';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { ExpandMoreSharp } from '@mui/icons-material';
import axios from 'config/AxiosConfig';

interface CategoryDetailProps {
  raceId: string;
  category: CategoryWithStages;
  columns: GridColDef[];
}

function CategoryResult({
  raceId,
  category,
  columns,
}: CategoryDetailProps): React.JSX.Element {
  const [racerList, setRacerList] = useState<Array<RacerResult>>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const getRacerStatusList = () => {
      axios
        .get(`/racers/results?raceId=${raceId}&categoryId=${category.id}`)
        .then((res) => {
          setIsLoaded(true);
          setRacerList(res.data);
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
          <Typography>{category.name}</Typography>
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
              columns={columns}
            />
          )}
        </AccordionDetails>
      </Accordion>
      <Divider />
    </div>
  );
}

export default CategoryResult;
