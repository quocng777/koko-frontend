type AuthLayoutProps = {
    children : React.ReactNode;
    title: string
}

export const AuthLayout = ({ children, title}: AuthLayoutProps) => {
    return (
        <>
            <div className="min-h-screen">
                {children}
            </div>
        </>
    )
} 