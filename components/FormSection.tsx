import { Box, Flex, Grid, Text } from "@chakra-ui/react";

type FormSectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const FormSection = (props: FormSectionProps) => {
  return (
    <Grid
      gap={[4, 6]}
      gridTemplateColumns={["1fr", "250px minmax(auto, 500px)"]}
      justifyContent={["stretch", "space-between"]}
    >
      <Flex direction="column" gap="2">
        {props.title && <Text as="h2">{props.title}</Text>}
        {props.description && (
          <Text as="p" css={{ color: "$slate11" }} size="2">
            {props.description}
          </Text>
        )}
      </Flex>
      <Box py="4" pl={[0, 4]}>
        <Flex direction="column" gap="4">
          {props.children}
        </Flex>
      </Box>
    </Grid>
  );
};

export default FormSection;
