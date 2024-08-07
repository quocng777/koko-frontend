import { useSelector } from "react-redux";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { Navigate } from "react-router-dom";

type AuthLayoutProps = {
    children : React.ReactNode;
    title: string
}

export const AuthLayout = ({ children, title}: AuthLayoutProps) => {
    const user = useSelector(getCurrentAuthentication);
    console.log(user);

    return (
        <>
            {
                !user ? 
                <div className="min-h-screen">
                    {children}
                </div> :
                <Navigate to={'/'} replace/>
            }
        </>
    )
} 