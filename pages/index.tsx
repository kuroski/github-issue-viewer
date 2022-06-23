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
      {issues.data && (
        <div>
          <div>{issues.data.totalCount}</div>
          <ul>
            {issues.data.nodes.map((issue) => (
              <li key={issue.url}>
                <a href={issue.url}>{issue.titleHTML}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const toast = useToast();
  const { data: session } = useSession();

  return <DefaultLayout>{session?.user && <IssuesList />}</DefaultLayout>;
};

export default Home;
