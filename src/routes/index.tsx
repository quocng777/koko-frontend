import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/login',
        lazy: async () => {
            const { LoginRoute } = await import('../features/auth/login');
            return {
                Component: LoginRoute
            }
        }
    }
])