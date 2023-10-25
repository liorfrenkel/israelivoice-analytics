import { useQuery, gql } from '@apollo/client';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { intervalToDuration, formatDuration } from 'date-fns';

const SHARED_BRIEF_FLOW_BOARD = 1287143776;

export const ItemsStatusDuration = () => {
  const { loading, error, data, fetchMore } = useQuery(
    gql`
    query BoardItems($cursor: String) {
      boards(ids: [${SHARED_BRIEF_FLOW_BOARD}]) {
        id
        name

        items_page (limit: 200, cursor: $cursor) {
          cursor
          items {
            id
            name
          }
        }
      }
    }
  `
  );

  const board = data?.boards?.[0];
  const cursor: string = board?.items_page?.cursor;
  console.log({ cursor });
  const items = board?.items_page?.items as { id: string; name: string }[];
  const itemIds = items?.map((item) => item.id).join(',');

  const { data: activityLogs, loading: activityLoading } = useQuery(
    gql`
    query {
      boards(ids: [${SHARED_BRIEF_FLOW_BOARD}]) {
        activity_logs (item_ids: [${itemIds}], column_ids: ["status0"], from: "2023-10-07", limit:1000) {
          data
          created_at
        }
      }
    }
  `,
    { skip: !itemIds }
  );

  if (loading || activityLoading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  const activity: { itemId: string; createdAt: Date; value: string; prevValue: string }[] | undefined =
    activityLogs?.boards?.[0]?.activity_logs?.map((a) => {
      const data = JSON.parse(a.data);

      return {
        itemId: String(data.pulse_id),
        createdAt: new Date(Number(a.created_at) / 10000),
        value: data.value?.label?.text || '',
        prevValue: data.previous_value?.label?.text || '',
      };
    });

  const groupByItemId = activity?.reduce((acc, a) => {
    const arr = acc.get(a.itemId) || [];
    arr.push(a);
    acc.set(a.itemId, arr);
    return acc;
  }, new Map<string, { createdAt: Date; value: string; prevValue: string }[]>());

  const final = new Map(
    Array.from(groupByItemId?.entries() || []).map(([key, value]) => {
      value.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return [
        key,
        value.map((v, index) => ({
          ...v,
          duration: intervalToDuration({ start: v.createdAt, end: value[index + 1]?.createdAt ?? new Date() }),
        })),
      ];
    })
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status changes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {final?.get(item.id)?.map((i, index) => (
                  <div key={index}>
                    <Typography dir="rtl" variant="body1">
                      <strong> {i.value} </strong>
                    </Typography>
                    <Typography dir="ltr" variant="caption">
                      {formatDuration(i.duration)}
                    </Typography>
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {cursor && (
        <Button
          variant="contained"
          onClick={() =>
            fetchMore({
              variables: { cursor },
              updateQuery: (_, { fetchMoreResult }) => {
                console.log({ fetchMoreResult });

                return fetchMoreResult;
              },
            })
          }
        >
          Load more
        </Button>
      )}
    </TableContainer>
  );
};
