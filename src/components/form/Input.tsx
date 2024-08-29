import {forwardRef, InputHTMLAttributes, useState } from "react"
import { twMerge } from "tailwind-merge";
import { Button } from "../buttons/button";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";

export type InputSize = "md" | "lg" | "xl"

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    id?: string;
    name?: string;
    className?: string;
    size?: InputSize;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(({ id, name, className, size = "md", type, ...props}, ref) => {

    const [ typeState, setTypeState ] = useState(type);
    const [ showPass, setShowPass ] = useState(true);

    const handleClickShowPassBtn = () => {
        typeState === "password" ? setTypeState("text") : setTypeState("password");
        setShowPass(prev => !prev);
    } 

    return (
        <div className="relative w-full">
            <input 
            type={typeState}
            name={name}
            className={
                twMerge("ring-1 ring-slate-400 rounded-md bg-background focus:outline-none focus:ring-primary", size == "md" ? "px-6 py-2" : "",
                    className
                )
        } id={id} ref={ref} {...props}/>

        {type == "password" &&
            <Button type="button" size="icon" variant="ghost" onClick={handleClickShowPassBtn} className="absolute top-1/2 right-1 -translate-y-1/3">
                {showPass ?  <FaRegEye /> : <FaRegEyeSlash />}
            </Button>}
        </div>
    )
})