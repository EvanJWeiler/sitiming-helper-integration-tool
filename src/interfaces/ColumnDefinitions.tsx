import { Box } from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import DNF_TIMER_VALUE from 'util/Constants';
import getFormattedTime from 'util/ResultsUtil';

function getCheckedInIcon(params: GridRenderCellParams) {
  const baseStyle = {
    height: '20px',
    width: '20px',
    borderRadius: '25%',
  };

  if (params.row.checkedIn) {
    return <Box style={{ ...baseStyle, backgroundColor: 'rgb(0, 200, 0)' }} />;
  }

  return <Box style={{ ...baseStyle, backgroundColor: 'rgb(200, 0, 0)' }} />;
}

export const CategoryStatusColumns: GridColDef[] = [
  { field: 'bibNumber', headerName: 'Bib #', width: 110, hideable: false },
  { field: 'racerName', headerName: 'Name', width: 200, hideable: false },
  {
    field: 'cardNumber',
    headerName: 'Si Card #',
    width: 125,
    hideable: false,
  },
  { field: 'teamName', headerName: 'Team Name', width: 300, hideable: false },
  {
    field: 'checkedIn',
    headerName: 'Checked In',
    width: 150,
    hideable: false,
    renderCell: getCheckedInIcon,
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.checkedIn;
    },
  },
];

export const RaceStatusColumns: GridColDef[] = [
  ...CategoryStatusColumns,
  {
    field: 'categoryName',
    headerName: 'Category',
    width: 300,
    hideable: false,
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.categoryName;
    },
  },
];

export const LeaderboardColumns: GridColDef[] = [
  {
    field: 'place',
    headerName: 'Place',
    width: 75,
    hideable: false,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (index) => index.api.getAllRowIds().indexOf(index.id) + 1,
  },
  { field: 'bibNumber', headerName: 'Bib #', minWidth: 110 },
  { field: 'racerName', headerName: 'Name', minWidth: 200, hideable: false },
  { field: 'teamName', headerName: 'Team Name', minWidth: 200 },
  {
    field: 'totalTime',
    headerName: 'Total',
    minWidth: 100,
    hideable: false,
    valueGetter: (params: GridValueGetterParams) => {
      const { resultsMap } = params.row;

      if (resultsMap.total_time === DNF_TIMER_VALUE) return 'DNF';

      return getFormattedTime(resultsMap.total_time);
    },
  },
];
