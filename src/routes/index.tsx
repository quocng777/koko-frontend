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
        element: (
        <ProtectedRoute>
            <MainLayout />
        </ProtectedRoute>),
        children: [
            {
                path: '/',
                element: <Navigate to={'/messages'} replace/>
            },
            {
                path: '/messages',
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const { MessagePage } = await import('../features/message/message-page');
                            return {
                                Component: MessagePage
                            };
                        }
                    },
                    {
                        path: '/messages/:consId',
                        lazy: async () => {
                            const { MessagePage } = await import('../features/message/message-page');
                            return {
                                Component: MessagePage
                            };
                        }
                    }
                ]
            },
            {
                path: '/home',
                element: <div>HOME</div>
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