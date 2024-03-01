import React from 'react';
import { Racer } from 'interfaces/Database';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface CategoryDetailProps {
  categoryId: string;
  racerList: Racer[];
  columnDefinition: GridColDef[];
}

function CategoryDetail({
  categoryId,
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
        rows={racerList.filter(
          (racer) => racer.categoryId && racer.categoryId.includes(categoryId),
        )}
        columns={columnDefinition}
        pageSizeOptions={[15]}
      />
    </div>
  );
}

export default CategoryDetail;
