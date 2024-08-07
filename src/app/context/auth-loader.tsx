import { ReactNode, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setAuthenticatedUser } from "../api/auth/auth-slice"
import { useGetAuthenticationQuery } from "../api/user/user-api-slice"

type AuthLoaderProps = {
    children: ReactNode
}

export const AuthLoader = ({ children}: AuthLoaderProps) => {
    const dispatch = useDispatch();

    const accessToken = localStorage.getItem("accessToken");
    const {data, isSuccess, isLoading, isError} = useGetAuthenticationQuery(undefined, {
        skip: !accessToken
    });
    
    useEffect(() => {
        if(data) {
            dispatch(setAuthenticatedUser(data?.data))
        }
    }, [data, isSuccess])

    return (
        <>
            {isLoading && 'Loading'}
            {(isSuccess || isError) && children}
        </>
    )
}