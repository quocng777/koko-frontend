import { createContext, useContext } from "react";

type ToastContextProps = {
    open: any,
    close: any
}

var toastInitial: ToastContextProps = {
    open: undefined,
    close: undefined
}

export const ToastContext = createContext(toastInitial);

export const useToast = () => {
    return useContext(ToastContext);
}