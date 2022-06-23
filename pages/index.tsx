import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Link,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Link1Icon } from "@radix-ui/react-icons";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useSession } from "next-auth/react";

import HelloForm from "@/components/HelloForm";
import DefaultLayout from "@/layouts/DefaultLayout";
import { trpc } from "@/lib/trpc";

type IssuesListProps = {};

const IssuesList = (props: IssuesListProps) => {
  const issues = trpc.useQuery(["github.issues.list"]);

  return (
    <div>
      <pre>{JSON.stringify(issues, null, 4)}</pre>
    </div>
  );
};

const Home: NextPage = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const pong = trpc.useQuery(["health.ping"], {
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.trace(err);
    },
  });
  const pongMutation = trpc.useMutation(["health.pong"], {
    onError: (error) => {
      toast({
        title: `Something went wrong: ${error}`,
        colorScheme: "red",
      });
    },
  });

  return (
    <DefaultLayout>
      <Flex gap="4" alignItems="center" mt="2" mb="4">
        <Button
          variant="outline"
          colorScheme="blue"
          isLoading={pong.isLoading || pong.isRefetching}
          onClick={() => {
            toast({
              title: "Fetching data",
              variant: "subtle",
            });
            pong.refetch();
          }}
        >
          Refresh
        </Button>
        <NextLink href={{ pathname: "/private" }} passHref>
          <Link color="blue.500" display="flex" alignItems="center" gap="1">
            <Link1Icon /> Private route
          </Link>
        </NextLink>
        <NextLink href={{ pathname: "/only-admin" }} passHref>
          <Link color="blue.500" display="flex" alignItems="center" gap="1">
            <Link1Icon /> Admin only route
          </Link>
        </NextLink>
      </Flex>

      {pong.data && !pong.isRefetching && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>
            {pong.data} - {pong.isStale ? "stale" : "new"}
          </AlertTitle>
        </Alert>
      )}
      {pong.isError && (
        <Alert status="error">{JSON.stringify(pong.error, null, 4)}</Alert>
      )}
      {pong.isLoading ||
        (pong.isRefetching && (
          <Center mt="4">
            <Spinner />
          </Center>
        ))}

      {session?.user && <IssuesList />}

      <Box mt="6">
        <HelloForm
          isSubmitting={pongMutation.isLoading}
          onSubmit={(values) =>
            pongMutation.mutateAsync(null, {
              onSuccess: (data) => {
                toast({ title: `Hello ${values.name}`, description: data });
              },
            })
          }
        />
      </Box>
    </DefaultLayout>
  );
};

export default Home;
