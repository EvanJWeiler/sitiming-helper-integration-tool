import React from 'react';
import { RaceInfoState, ResultState } from 'interfaces/State';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
} from '@mui/material';
import { ExpandMoreSharp } from '@mui/icons-material';
import LeaderboardDetail from './LeaderboardDetail';

interface RaceLeaderboardProps {
  raceInfoState: RaceInfoState;
  resultsState: ResultState;
}

function RaceLeaderboard({
  raceInfoState,
  resultsState,
}: RaceLeaderboardProps): React.JSX.Element {
  return (
    <div>
      {raceInfoState.categoryList.map(({ id, name }) => (
        <div key={id}>
          <Accordion
            disableGutters
            square
            disabled={
              raceInfoState.racerList.filter((racer) => racer.categoryId === id)
                .length === 0
            }
          >
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
              <Typography>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LeaderboardDetail
                racerList={raceInfoState.racerList}
                categoryId={id}
                resultsMap={resultsState.results}
                numStages={7}
              />
            </AccordionDetails>
          </Accordion>
          <Divider light />
        </div>
      ))}
    </div>
  );
}

export default RaceLeaderboard;
