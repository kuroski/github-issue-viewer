/* eslint-disable react/display-name */
import { FormErrorMessage } from "@chakra-ui/react";
import {
  FieldError as ReactHookFieldError,
  RegisterOptions,
} from "react-hook-form";

type FieldErrorsProps = {
  errors: ReactHookFieldError | ReactHookFieldError[] | undefined;
  customMessages?: Partial<Record<keyof RegisterOptions, string>>;
};

const FieldError =
  (customMessages: FieldErrorsProps["customMessages"]) =>
  (error: ReactHookFieldError | undefined) => {
    if (!error) return <></>;
    switch (error.type) {
      case "required":
        return (
          <FormErrorMessage>
            {customMessages?.required || "This is a required field"}
          </FormErrorMessage>
        );

      default:
        return (
          <FormErrorMessage>
            Oops, something went wrong... {error.type}
          </FormErrorMessage>
        );
    }
  };

const FieldErrors = (props: FieldErrorsProps) => {
  const Field = FieldError(props.customMessages);
  if (Array.isArray(props.errors)) return <>{props.errors.map(Field)}</>;
  return Field(props.errors);
};

export default FieldErrors;
