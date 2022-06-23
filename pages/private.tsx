import { Alert, AlertIcon, AlertTitle, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import DefaultLayout from "@/layouts/DefaultLayout";
import { NextPageWithAuth } from "@/lib/types";

const Private: NextPageWithAuth = () => {
  return (
    <DefaultLayout>
      <NextLink href={{ pathname: "/" }} passHref>
        <Link color="blue.500">Back to home</Link>
      </NextLink>

      <Alert status="info" mt="4">
        <AlertIcon />
        <AlertTitle>This is a private route</AlertTitle>
      </Alert>
    </DefaultLayout>
  );
};

Private.auth = true;

export default Private;
