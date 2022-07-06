import {
  Alert,
  AlertIcon, Box, Button, ButtonGroup, Center,
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
  createTable,
  getCoreRowModel,
  getFilteredRowModel,
  useTableInstance
} from "@tanstack/react-table";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { createEnumParam, useQueryParams, withDefault } from "next-query-params";
import { useEffect, useState } from "react";

import Filters from "@/components/Filters";
import IssueRow from "@/components/IssueRow";
import OpenIcon from "@/components/OpenIcon";
import DefaultLayout from "@/layouts/DefaultLayout";
import { IssueDecoder, State } from "@/lib/decoders/issue";
import { Visibility } from "@/lib/decoders/issue";
import { IssueFilter, issueFilterDecoder, IssueMeta, IssueType } from "@/lib/decoders/issueFilter";
import { trpc } from "@/lib/trpc";

// TABLE
const table = createTable()
  .setRowType<IssueDecoder>()
  .setTableMetaType<IssueMeta>()

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
  table.createDataColumn((issue) => issue, {
    id: 'cell',
    header: ({ instance }) => {
      const { openCount, closedCount } = instance.options.meta ?? {
        openCount: 0,
        closedCount: 0
      }
      const filters = issueFilterDecoder.parse(instance.getState().globalFilter)
      return (
        <ButtonGroup variant="ghost" colorScheme="gray.500" >
          <Button
            {...filters.state === 'open' ? { color: 'blue.500' } : {}}
            onClick={() => {
              instance.resetRowSelection()
              instance.setGlobalFilter(() => ({ ...filters, state: 'open' }))
            }}
          >
            <Flex alignItems="center" gap="2">
              <OpenIcon color="inherit" />
              Open {openCount}
            </Flex>
          </Button>
          <Button
            {...filters.state === 'closed' ? { color: 'blue.500' } : {}}
            onClick={() => {
              instance.resetRowSelection()
              instance.setGlobalFilter(() => ({ ...filters, state: 'closed' }))
            }}
          >
            <Flex alignItems="center" gap="2">
              <CheckIcon width="24" height="24" />
              Closed {closedCount}
            </Flex>
          </Button>
        </ButtonGroup >
      )
    },
    cell: info => <IssueRow issue={info.getValue()} />,
  })
];

// COMPONENT
const IssuesList = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [query, setQuery] = useQueryParams({
    state: withDefault(createEnumParam<State>(['all', 'open', 'closed']), 'open'),
    type: withDefault(createEnumParam<IssueType>(['assigned', 'created', 'mentioned']), 'created'),
    visibility: withDefault(createEnumParam<Visibility>(['all', 'public', 'private']), 'all'),
  })
  const [globalFilter, setGlobalFilter] = useState<IssueFilter>({
    state: query.state || 'open',
    type: query.type || 'created',
    visibility: query.visibility || 'all',
  })

  const issues = trpc.useQuery(["github.issues.list", query], {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const instance = useTableInstance(table, {
    data: issues.data?.issues ?? [],
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: issues.data?.meta ?? {
      closedCount: 0,
      openCount: 0
    }
  });

  useEffect(() => {
    setQuery(globalFilter)
  }, [globalFilter])

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
    <Flex direction="column" mt="10">
      <Flex mb="4" gap="4" alignItems="center" justifyContent="space-between">
        <Filters globalFilter={globalFilter} onChange={(value) => {
          setGlobalFilter({
            ...globalFilter,
            ...value
          })
        }} />
        <Button type="button" onClick={() => setGlobalFilter({ ...globalFilter, state: 'all' })} alignSelf="flex-end" variant="outline">Clear</Button>
      </Flex>

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
    </Flex>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  return <DefaultLayout>{session?.user && <IssuesList />}</DefaultLayout>;
};

export default Home;
