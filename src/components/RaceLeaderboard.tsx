import React, { useEffect, useState } from 'react';
import { validate as uuidValidate } from 'uuid';
import { CategoryWithStages } from 'interfaces/Database';
import { List } from '@mui/material';
import axios from 'config/AxiosConfig';
import { LeaderboardColumns } from 'interfaces/ColumnDefinitions';
import { GridValueGetterParams } from '@mui/x-data-grid';
import getFormattedTime from 'util/ResultsUtil';
import CategoryResult from './CategoryResult';

interface RaceLeaderboardProps {
  raceId: string;
}

function RaceLeaderboard({ raceId }: RaceLeaderboardProps): React.JSX.Element {
  const [categoryList, setCategoryList] = useState<Array<CategoryWithStages>>(
    [],
  );

  useEffect(() => {
    const getCategoryList = () => {
      axios
        .get(`/categories/stages?raceId=${raceId}`)
        .then((res) => {
          setCategoryList(res.data);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    };

    if (uuidValidate(raceId)) {
      getCategoryList();
    }
  }, [raceId]);

  const generateLeaderboardColumns = (category: CategoryWithStages) => {
    const columns = [...LeaderboardColumns];

    category.stageList.forEach((stage, i) => {
      columns.push({
        field: `stage${i}`,
        headerName: stage.label,
        flex: 1,
        maxWidth: 200,
        align: 'right',
        headerAlign: 'right',
        hideable: false,
        valueGetter: (params: GridValueGetterParams) => {
          const { resultsMap } = params.row;

          if (!resultsMap[stage.code]) return 'n/a';

          return getFormattedTime(resultsMap[stage.code]);
        },
      });
    });

    return columns;
  };

  return (
    <div>
      {categoryList.length !== 0 && (
        <List>
          {categoryList.map((category) => (
            <div key={category.id}>
              <CategoryResult
                raceId={raceId}
                category={category}
                columns={generateLeaderboardColumns(category)}
              />
            </div>
          ))}
        </List>
      )}
    </div>
  );
}

export default RaceLeaderboard;
