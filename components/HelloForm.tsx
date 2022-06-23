import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import FieldErrors from "@/components/FieldErrors";
import FormSection from "@/components/FormSection";

type FormData = {
  name: string;
};

type HelloFormProps = {
  defaultValues?: FormData;
  isSubmitting?: boolean;
  onSubmit: SubmitHandler<FormData>;
};

const HelloForm = ({
  defaultValues,
  isSubmitting,
  onSubmit,
}: HelloFormProps) => {
  const { register, formState, getValues, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    });

  const { isSubmitSuccessful } = formState;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues());
    }
  }, [isSubmitSuccessful, reset, getValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="4">
        <FormSection
          title="Personal information"
          description="Please feel in your username in order to continue"
        >
          <FormControl isInvalid={Boolean(formState.errors.name)}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input {...register("name", { required: true })} />
            <FieldErrors errors={formState.errors.name} />
          </FormControl>
        </FormSection>

        <Button alignSelf="end" type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </Flex>
    </form>
  );
};

export default HelloForm;
