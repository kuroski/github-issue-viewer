import { Container } from "@chakra-ui/react";

import Header from "@/components/Header";

interface DefaultLayoutProps {
  children: React.ReactNode[] | React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <Container py={4} maxW="4xl">
      <Header />

      <div>{children}</div>
    </Container>
  );
}

export default DefaultLayout;
