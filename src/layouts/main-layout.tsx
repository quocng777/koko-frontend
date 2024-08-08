import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

type SideNavigationItem = {
    name: string,
    to: string,
    icon: any
};

export const MainLayout = () => {
    return (
        <div className="flex min-h-screen w-full">
            <aside>
                ASIDE
                <Outlet />
            </aside>
        </div>
    )
}