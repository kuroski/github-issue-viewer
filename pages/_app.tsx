import "../styles/globals.css";

import { Center, ChakraProvider, Link, Spinner, Text } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { Link1Icon } from "@radix-ui/react-icons";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import NextLink from "next/link";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { ReactQueryDevtools } from "react-query/devtools";

import { transformer } from "@/lib/trpc";
import { NextPageWithAuth } from "@/lib/types";
import { AppRouter } from "@/server/routers/_app";

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

function MyApp({ Component, pageProps }: AppPropsWithAuth) {
  return (
    <SessionProvider session={pageProps.session} refetchOnWindowFocus={false}>
      <ChakraProvider>
        {Component.auth ? (
          <Auth
            {...(typeof Component.auth === "object"
              ? { can: Component.auth.can }
              : {})}
          >
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}

        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ChakraProvider>
    </SessionProvider>
  );
}

type AuthProps = {
  children: React.ReactNode;
  can?: Role[];
};

function Auth(props: AuthProps) {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  if (status === "loading")
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!isUser) {
    signIn();
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!props.can) return <>{props.children}</>;
  if (props.can.includes(session.user.role)) return <>{props.children}</>;

  return (
    <Center>
      <Text mr="2">{t("no_permission")}</Text>

      <NextLink href={{ pathname: "/" }} passHref>
        <Link color="blue.500" display="flex" alignItems="center" gap="1">
          <Link1Icon />
          {t("back_to_home")}
        </Link>
      </NextLink>
    </Center>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      return {
        transformer,
        url: "/api/trpc",
      };
    }
    // during SSR below

    const url = process.env.NEXT_PUBLIC_API_HOST
      ? `${process.env.NEXT_PUBLIC_API_HOST}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      transformer,
      url,
      headers: {
        // inform server that it's an ssr request
        "x-ssr": "1",
      },
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
})(MyApp);
