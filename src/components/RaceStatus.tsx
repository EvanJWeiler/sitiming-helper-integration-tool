import React from 'react';
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
import { ListState, RaceInfoState } from 'interfaces/State';
import {
  CategoryStatusColumns,
  RaceStatusColumns,
} from 'interfaces/ColumnDefinitions';
import CategoryDetail from './CategoryDetail';

interface RaceStatusProps {
  raceInfoState: RaceInfoState;
  listState: ListState;
}

function RaceStatus({
  raceInfoState,
  listState,
}: RaceStatusProps): React.JSX.Element {
  function getCategoryStatus(categoryId: string) {
    const baseStyle = {
      height: '25px',
      width: '25px',
      borderRadius: '25%',
      marginRight: '10px',
    };

    const racersInCat = raceInfoState.racerList.filter(
      (racer) => racer.categoryId && racer.categoryId.includes(categoryId),
    ).length;

    const racersCheckedIn = raceInfoState.racerList.filter(
      (racer) =>
        racer.categoryId &&
        racer.categoryId.includes(categoryId) &&
        racer.checkedIn,
    ).length;

    if (racersInCat === 0) {
      return { ...baseStyle, backgroundColor: 'rgb(150, 150, 150)' };
    }

    if (racersCheckedIn === racersInCat) {
      return { ...baseStyle, backgroundColor: 'rgb(0, 200, 0)' };
    }

    if (racersCheckedIn === 0 && racersInCat > 0) {
      return { ...baseStyle, backgroundColor: 'rgb(200, 0, 0)' };
    }

    return { ...baseStyle, backgroundColor: 'rgb(220, 220, 0)' };
  }

  function getCategoryStatusString(categoryId: string) {
    const racersInCat = raceInfoState.racerList.filter(
      (racer) => racer.categoryId && racer.categoryId.includes(categoryId),
    ).length;

    const racersCheckedIn = raceInfoState.racerList.filter(
      (racer) =>
        racer.categoryId &&
        racer.categoryId.includes(categoryId) &&
        racer.checkedIn,
    ).length;

    if (racersInCat === 0) {
      return 'N/A';
    }

    return `${racersCheckedIn}/${racersInCat} (${
      racersInCat - racersCheckedIn
    })`;
  }

  // TODO: emergency contact info getter?
  // TODO: do not reload page every time route is loaded
  return (
    <div>
      {raceInfoState.categoryList.length !== 0 && (
        <List>
          <Accordion disableGutters square>
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
              <Box style={getCategoryStatus('')} />
              <Typography>
                {
                  listState.raceList
                    .filter((race) => race.id === listState.selectedRace)
                    .at(0)?.name
                }
              </Typography>
              <Chip
                variant="outlined"
                label={getCategoryStatusString('')}
                style={{
                  height: '25px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <CategoryDetail
                categoryId=""
                racerList={raceInfoState.racerList}
                columnDefinition={RaceStatusColumns}
              />
            </AccordionDetails>
          </Accordion>
          <Divider light />
          {raceInfoState.categoryList.map(({ id, name }) => (
            <div key={id}>
              <Accordion
                disableGutters
                square
                disabled={
                  raceInfoState.racerList.filter(
                    (racer) => racer.categoryId === id,
                  ).length === 0
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                  <Box style={getCategoryStatus(id)} />
                  <Typography>{name}</Typography>
                  <Chip
                    variant="outlined"
                    label={getCategoryStatusString(id)}
                    style={{
                      height: '25px',
                      marginLeft: '10px',
                    }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <CategoryDetail
                    categoryId={id}
                    racerList={raceInfoState.racerList}
                    columnDefinition={CategoryStatusColumns}
                  />
                </AccordionDetails>
              </Accordion>
              <Divider light />
            </div>
          ))}
        </List>
      )}
    </div>
  );
}

export default RaceStatus;
