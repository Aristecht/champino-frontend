"use client";

import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/utils/tw-merge";
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  LabelHTMLAttributes,
  useContext,
  useId,
} from "react";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext)
    throw new Error("useFormField must be used inside <FormField>");

  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = { id: string };

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={cn("flex flex-col gap-1.5", className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = "FormItem";

const FormLabel = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <label
      ref={ref}
      htmlFor={formItemId}
      className={cn(
        "text-foreground mb-1 text-sm leading-none font-medium",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        error && "text-destructive",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();
    return (
      <div
        ref={ref}
        id={formItemId}
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
        }
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
FormControl.displayName = "FormControl";

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-muted-foreground mt-0.5 text-xs", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? error) : children;
  if (!body) return null;
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        "text-destructive flex items-center gap-1 text-xs font-medium",
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
