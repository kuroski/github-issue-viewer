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
import { ArrayParam, createEnumParam, useQueryParams, withDefault } from "next-query-params";
import { useEffect, useState } from "react";

import Filters from "@/components/Filters";
import IssueRow from "@/components/IssueRow";
import OpenIcon from "@/components/OpenIcon";
import DefaultLayout from "@/layouts/DefaultLayout";
import { Filter, filterDecoder, FilterMeta, IssueType } from "@/lib/decoders/filter";
import { IssueDecoder, State } from "@/lib/decoders/issue";
import { Visibility } from "@/lib/decoders/issue";
import { trpc } from "@/lib/trpc";

// TABLE
const table = createTable()
  .setRowType<IssueDecoder>()
  .setTableMetaType<FilterMeta>()

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
      const filters = filterDecoder.parse(instance.getState().globalFilter)
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
  const [queryParams, setQueryParams] = useQueryParams({
    state: withDefault(createEnumParam<State>(['all', 'open', 'closed']), 'open'),
    type: withDefault(createEnumParam<IssueType>(['assigned', 'created', 'mentioned']), 'created'),
    visibility: withDefault(createEnumParam<Visibility>(['all', 'public', 'private']), 'all'),
    orgs: ArrayParam,
    repos: ArrayParam
  })
  const [globalFilter, setGlobalFilter] = useState<Filter>({
    state: queryParams.state || 'open',
    type: queryParams.type || 'created',
    visibility: queryParams.visibility || 'all',
    orgs: queryParams.orgs || [],
    repos: queryParams.repos || [],
  })

  const query = trpc.useQuery(["github.issues.list", queryParams], {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const instance = useTableInstance(table, {
    data: query.data?.issues ?? [],
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
    meta: query.data?.meta ?? {
      closedCount: 0,
      openCount: 0
    }
  });

  useEffect(() => {
    setQueryParams(globalFilter)
  }, [globalFilter])

  if (!query.data)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (query.error)
    return (
      <Alert status="error">
        <>
          <AlertIcon />
          {query.error}
        </>
      </Alert>
    );

  return (
    <Flex direction="column" mt="10">
      <Flex mb="4" gap="4" alignItems="center" justifyContent="space-between">
        <Filters
          orgs={query.data.orgs}
          repos={query.data.repos}
          globalFilter={globalFilter}
          onChange={(value) => {
            setGlobalFilter({
              ...globalFilter,
              ...value
            })
          }} />
        <Button type="button" onClick={() => setGlobalFilter({ state: 'all', type: null, visibility: null, repos: [], orgs: [] })} alignSelf="flex-end" variant="outline">Clear</Button>
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
