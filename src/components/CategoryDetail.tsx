import React from 'react';
import { Racer } from 'interfaces/Database';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface CategoryDetailProps {
  racerList: Racer[];
  columnDefinition: GridColDef[];
}

function CategoryDetail({
  racerList,
  columnDefinition,
}: CategoryDetailProps): React.JSX.Element {
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
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        pageSizeOptions={[15, 25, 50]}
        rows={racerList}
        columns={columnDefinition}
      />
    </div>
  );
}

export default CategoryDetail;
