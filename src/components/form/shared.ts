import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

export const formFieldPropsKeys = [
  "control",
  "defaultValue",
  "disabled",
  "name",
  "rules",
  "shouldUnregister",
] as const;

export type WithControllerProps<
  T,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = T & Omit<ControllerProps<TFieldValues, TName>, "render">;
