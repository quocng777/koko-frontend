import { createContext, MouseEventHandler, ReactNode, useContext, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../buttons/button"
import { IoCloseOutline } from "react-icons/io5";

const ModalContext = createContext<{
    close?: () => void;
  }>({});

type ModalRootProps =  {
    children: ReactNode,
    className?: string,
    onClose: () => void
}

export const ModalRoot = ({ children, className, onClose }: ModalRootProps) => {

    const rootRef = useRef<HTMLDivElement | null>(null);

    const handleBgClick: MouseEventHandler<HTMLDivElement> = (event) => {
        if(event.target == event.currentTarget) {
            onClose();
        }
    }

    return (
        <ModalContext.Provider value={{close: onClose}}>
            <div 
            className="bg-slate-700 absolute inset-0 bg-opacity-65 flex items-center justify-center"
            onMouseUp={handleBgClick}>
                <div 
                    className={
                        twMerge("flex flex-col bg-background max-w-[32rem] w-full rounded-2xl py-6 px-8",
                            className)}
                    >
                    {children}
                </div>
            </div>
        </ModalContext.Provider>
    )
}

type ModalHeader = {
    title: string,
    icon?: ReactNode,
    className?: string
}
export const ModalHeader = ({title, icon, className}: ModalHeader) => {

    const ctx = useContext(ModalContext);

    return (
        <div className={twMerge(
            'flex items-center',
            className
        )}>
            <p className="text-lg font-semibold">{title}</p>
            <Button 
                variant="ghost" 
                size="icon" 
                className="hover:text-red-500 ml-auto text-lg"
                onClick={ctx.close!}
                >
                <IoCloseOutline />
            </Button>
        </div>
    )
}

type ModalBody = {
    children: ReactNode,
    className?: string
}
export const ModalBody =({children, className}: ModalBody) => {
    return (
        <div className={twMerge(
            "w-full mt-2 flex-1",
            className
        )}>
            {children}
        </div>
    )
}

type ModalFooterProps = {
    children: ReactNode,
    className?: string
}
export const ModalFooter = ({ children, className }: ModalFooterProps) => {
    return (
        <div className={
            twMerge("w-full flex justify-center items-center gap-4",
                className
            )
        }>
            { children }
        </div>
    )
}