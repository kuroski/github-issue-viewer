import {
  Alert,
  AlertIcon, Center,
  Checkbox, Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  createTable,
  getCoreRowModel,
  useTableInstance
} from "@tanstack/react-table";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

import IssueRow from "@/components/IssueRow";
import DefaultLayout from "@/layouts/DefaultLayout";
import { IssueDecoder } from "@/lib/decoders/issue";
import { trpc } from "@/lib/trpc";

const table = createTable().setRowType<IssueDecoder>();

const columns = [
  table.createDisplayColumn({
    id: "select",
    header: ({ instance }) => (
      <Checkbox
        {...{
          isChecked: instance.getIsAllRowsSelected(),
          isIndeterminate: instance.getIsSomeRowsSelected(),
          onChange: instance.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        {...{
          isChecked: row.getIsSelected(),
          isIndeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  }),
  table.createDataColumn(
    (row) => <IssueRow issue={row} />,
    {
      id: "cell",
      header: () => <div>Filters will appear here!</div>,
      cell: (info) => info.getValue(),
    }
  ),
];

type IssuesListProps = {};

const IssuesList = (props: IssuesListProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const issues = trpc.useQuery(["github.issues.list"], {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const instance = useTableInstance(table, {
    data: issues.data ?? [],
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  if (!issues.data)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (issues.error)
    return (
      <Alert status="error">
        <>
          <AlertIcon />
          {issues.error}
        </>
      </Alert>
    );

  return (
    <TableContainer>
      <Table>
        <Thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : header.renderHeader()}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {instance.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>{cell.renderCell()}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  return <DefaultLayout>{session?.user && <IssuesList />}</DefaultLayout>;
};

export default Home;
