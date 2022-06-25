import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Checkbox,
  ColorProps,
  Flex,
  Heading,
  Link,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { CheckCircledIcon, Link1Icon } from "@radix-ui/react-icons";
import {
  createTable,
  getCoreRowModel,
  useTableInstance,
} from "@tanstack/react-table";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import DefaultLayout from "@/layouts/DefaultLayout";
import { IssueDecoder, State } from "@/lib/decoders/issue";
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
    (row) => {
      const stateColor: ColorProps["color"] =
        row.state === "open" ? "green.500" : "purple.500";
      return (
        <Flex alignItems="center" gap="2">
          <>
            <Box color={stateColor}>
              <CheckCircledIcon />
            </Box>
            <Heading as="h3" size="sm" flex="1">
              <NextLink href={{ pathname: "/issues/:id" }} passHref>
                <Link>{row.title}</Link>
              </NextLink>
            </Heading>

            <Link href={row.url} target="_blank">
              <Link1Icon />
            </Link>
          </>
        </Flex>
      );
    },
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
  const toast = useToast();
  const { data: session } = useSession();

  return <DefaultLayout>{session?.user && <IssuesList />}</DefaultLayout>;
};

export default Home;
