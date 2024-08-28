import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { useSelector } from "react-redux";
import { MainLayout } from "../layouts/main-layout";
import { ToastProvider } from "../app/context/toast-provider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector(getCurrentAuthentication);
    const location = useLocation();

    return user ? <ToastProvider>
        <>{children}</>
    </ToastProvider> : <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace></Navigate>
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
            },
            {
                path: '/friends',
                lazy: async () => {
                    const { FriendPage } = await import('../features/friend/friend-page');

                    return {
                        Component: FriendPage
                    }
                },
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const { FriendTab } = await import('../features/friend/friend-tab');
                            return {
                                Component: FriendTab
                            }
                        }
                    },
                    {
                        path: 'requests',
                        lazy: async() => {
                            const { FriendRequestTab } = await import('../features/friend/friend-request-tab')

                            return {
                                Component: FriendRequestTab
                            }
                        }
                    },
                    {
                        path: 'suggestion',
                        element: <div>Suggestion</div>
                    }
                ]
            },
            {
                path: '/notifications',
                lazy: async() => {
                    const { NotificationPage } = await import('../features/notification/notification-page');

                    return {
                        Component: NotificationPage
                    }
                }
            }
        ]
    }
]);