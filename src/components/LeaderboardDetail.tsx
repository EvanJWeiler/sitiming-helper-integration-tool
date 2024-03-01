import React from 'react';
import { Racer } from 'interfaces/Database';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Results } from 'interfaces/Schema';
import { LeaderboardColumns } from 'interfaces/ColumnDefinitions';

interface LeaderboardDetailProps {
  categoryId: string;
  racerList: Racer[];
  resultsMap: Results;
  numStages: number;
}

const getFormattedTime = (timeInMs: number): string => {
  const hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
  const seconds = Math.floor((timeInMs / 1000) % 60);
  const centisecond = Math.floor((timeInMs / 10) % 100);

  let timeString = '';

  if (hours > 0) timeString += `${hours}:`;

  if (minutes < 10 && minutes >= 0) {
    timeString += `0${minutes}`;
  } else {
    timeString += minutes;
  }

  if (seconds < 10 && seconds >= 0) {
    timeString += `:0${seconds}`;
  } else {
    timeString += `:${seconds}`;
  }

  if (centisecond < 10 && centisecond >= 0) {
    timeString += `:0${centisecond}`;
  } else {
    timeString += `:${centisecond}`;
  }

  return timeString;
};

const generateLeaderboardColumns = (
  resultsMap: Results,
  numStages: number,
): GridColDef[] => {
  const baseColumns = [...LeaderboardColumns];

  baseColumns.unshift({
    field: 'place',
    headerName: 'Place',
    width: 75,
    hideable: false,
    renderCell: (index) => index.api.getAllRowIds().indexOf(index.id) + 1,
  });

  baseColumns.push({
    field: 'total',
    headerName: 'Total',
    width: 100,
    hideable: false,
    valueGetter: (params: GridValueGetterParams) => {
      const { cardNumber } = params.row;
      const racerResult = resultsMap[cardNumber];

      if (!racerResult) return '';

      if (racerResult.find((result) => result.stageTime === -1)) return 'DNF';

      const totalTime = racerResult.at(0)!.stageTime;

      return getFormattedTime(totalTime);
    },
  });

  for (let i = 1; i <= numStages; i += 1) {
    baseColumns.push({
      field: `stage${i}`,
      headerName: `Stage ${i}`,
      width: 100,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        const { cardNumber } = params.row;
        const racerResult = resultsMap[cardNumber];

        if (!racerResult) return '';

        const currResult = racerResult.find((result) => result.stageNum === i);

        return currResult ? getFormattedTime(currResult.stageTime) : '';
      },
    });
  }

  return baseColumns;
};

function LeaderboardDetail({
  categoryId,
  racerList,
  resultsMap,
  numStages,
}: LeaderboardDetailProps): React.JSX.Element {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <DataGrid
        density="compact"
        disableRowSelectionOnClick
        autoHeight
        initialState={{
          sorting: {
            sortModel: [{ field: 'total', sort: 'asc' }],
          },
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        pageSizeOptions={[15, 25, 50]}
        rows={racerList.filter(
          (racer) => racer.categoryId && racer.categoryId.includes(categoryId),
        )}
        columns={generateLeaderboardColumns(resultsMap, numStages)}
      />
    </div>
  );
}

export default LeaderboardDetail;
