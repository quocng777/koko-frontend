import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { useSelector } from "react-redux";
import { MainLayout } from "../layouts/main-layout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector(getCurrentAuthentication);
    const location = useLocation();

    return user ? <>{children}</> : <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace></Navigate>
}

export const router = createBrowserRouter([
    {
        path: '/login',
        lazy: async () => {
            const { LoginRoute } = await import('../features/auth/login');
            return {
                Component: LoginRoute
            }
        }
    },
    {
        path: '',
        element: (<ProtectedRoute>
            <MainLayout />
        </ProtectedRoute>),
        children: [
            {
                path: '/',
                element: (
                    <div>
                        HELLO
                    </div>
                )
            },
            {
                path: '/messages',
                element: (
                    <div>
                        HELLO
                    </div>
                )
            }
            // {
            //     path: '/messages',
            //     lazy: async() => {
            //         return {
            //             Component: 
            //         }
            //     }
            // }
        ]
    }
]);