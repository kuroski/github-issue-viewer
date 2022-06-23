import { Alert, AlertIcon, AlertTitle, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import DefaultLayout from "@/layouts/DefaultLayout";
import { NextPageWithAuth } from "@/lib/types";

const OnlyAdmin: NextPageWithAuth = () => {
  return (
    <DefaultLayout>
      <NextLink href={{ pathname: "/" }} passHref>
        <Link color="blue.500">Back to home</Link>
      </NextLink>

      <Alert status="info" mt="4">
        <AlertIcon />
        <AlertTitle>Only admins can see this route</AlertTitle>
      </Alert>
    </DefaultLayout>
  );
};

OnlyAdmin.auth = {
  can: ["ADMIN"],
};

export default OnlyAdmin;
