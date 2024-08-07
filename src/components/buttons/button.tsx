import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";

const buttonVariants = tv(
    {
        base: 'rounded-lg font-medium hover:bg-opacity-90 transition-all shrunk-0',
        variants: {
            size: {
                sm: '',
                md: 'px-3 py-2',
                lg: '',
                icon: 'rounded-full size-9 flex justify-center items-center'
            },
            variant: {
                primary: 'bg-primary text-primary-foreground',
                outline: '',
                secondary: '',
                ghost: 'bg-transparent hover:bg-black/5',
                link: 'inline text-sky-400 hover:underline p-0 font-normal',
            },
        },
        defaultVariants: {
            size: 'md',
            variant: 'primary'
        }

    }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>
& VariantProps<typeof buttonVariants>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({className, variant, size, ...props}, ref) => {
    return (
        <button className={twMerge(
            buttonVariants({size, variant}
            ), className
        )} ref={ref} {...props}>
            {props.children}
        </button>
    )
})

export {Button, buttonVariants}