import {
  Alert,
  AlertIcon, Button, ButtonGroup, Center,
  Checkbox, Flex, Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  ColumnFiltersState,
  createTable,
  getCoreRowModel,
  getFilteredRowModel,
  useTableInstance
} from "@tanstack/react-table";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { createEnumParam, useQueryParams, withDefault } from "next-query-params";
import { useEffect, useState } from "react";
import { z } from "zod";

import IssueRow from "@/components/IssueRow";
import OpenIcon from "@/components/OpenIcon";
import DefaultLayout from "@/layouts/DefaultLayout";
import { IssueDecoder, State, stateDecoder } from "@/lib/decoders/issue";
import { trpc } from "@/lib/trpc";

// TYPING
type Meta = {
  info: {
    closed: number;
    open: number;
  };
}

type Filter = {
  state: State
}

function isFilter(filter: unknown): filter is Filter {
  const decoder = z.object({
    state: stateDecoder.nullish()
  })
  if (decoder.parse(filter)) return true
  return false
}

// TABLE
const table = createTable()
  .setRowType<IssueDecoder>()
  .setFilterMetaType<Meta>()
  .setTableMetaType<Meta>()

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
      filterFn: (row, _columnId, value) => row.original?.state === value.state,
      header: ({ instance, header, column }) => {
        const { info } = instance.options.meta ?? {
          info: {
            open: 0,
            closed: 0
          }
        }
        const filter = column.getFilterValue()
        if (!isFilter(filter)) throw new Error(`Your filter type is not supported, ${JSON.stringify(filter, null, 2)}`)
        return (
          <ButtonGroup variant="ghost" colorScheme="gray.500" >
            <Button
              {...filter.state === 'open' ? { color: 'blue.500' } : {}}
              onClick={() => column.setFilterValue(() => ({ state: 'open' }))}
            >
              <Flex alignItems="center" gap="2">
                <OpenIcon color="inherit" />
                Open {info.open}
              </Flex>
            </Button>
            <Button
              {...filter.state === 'closed' ? { color: 'blue.500' } : {}}
              onClick={() => column.setFilterValue(() => ({ state: 'closed' }))}
            >
              <Flex alignItems="center" gap="2">
                <CheckIcon width="24" height="24" />
                Closed {info.closed}
              </Flex>
            </Button>
          </ButtonGroup >
        )
      },
      cell: (info) => info.getValue(),
    }
  ),
];

// COMPONENT

type IssuesListProps = {};

const IssuesList = (props: IssuesListProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [query, setQuery] = useQueryParams({
    state: withDefault(createEnumParam<State>(['open', 'closed']), 'open')
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'cell',
      value: {
        state: query.state
      }
    }
  ])

  const issues = trpc.useQuery(["github.issues.list"], {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const meta: Meta = {
    info: {
      closed: issues.data?.reduce((acc, issue) => issue.state === 'closed' ? acc + 1 : acc, 0) ?? 0,
      open: issues.data?.reduce((acc, issue) => issue.state === 'open' ? acc + 1 : acc, 0) ?? 0
    }
  }

  const instance = useTableInstance(table, {
    data: issues.data ?? [],
    columns,
    state: {
      rowSelection,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta
  });

  useEffect(() => {
    const filter = columnFilters[0]?.value
    if (!filter || !isFilter(filter)) return
    setQuery(filter)
  }, [columnFilters])

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
