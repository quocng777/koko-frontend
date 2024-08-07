import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Input, InputProps } from "./Input";
import { twMerge } from "tailwind-merge";


export type FormInputProps<TFormValues extends FieldValues> = InputProps & {
    name: Path<TFormValues>,
    register: UseFormRegister<TFormValues>,
    error?: FieldError;
}

export const FormInput = <T extends FieldValues>({
    className,
    name,
    register,
    error,
    ...props

  } : FormInputProps<T>) => {
    return (
      <div>
        <Input className={twMerge(
            error ? 'ring-1 ring-red-500 focus:ring-red-500' : '',
            className
        )} {...register(name)} {...props}/>
        {error && <p className="text-red-500 mt-2 text-sm">{error.message}</p>}
      </div>
    );
  };