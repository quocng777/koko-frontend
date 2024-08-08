import { AuthLayout } from "../../layouts/auth-layout"
import { LoginForm } from "./login-form"
import image from './../../assets/login_page_img.svg';

export const LoginRoute = () => {
    return (
        <AuthLayout title="Login to Koko">
            <div className="h-screen flex justify-center">
                <div className="hidden lg:flex lg:flex-col gap-16 justify-center px-24 max-w-[36rem]">
                    <h2 className="text-5xl font-bold">Hi these, welcome back to our service</h2>
                    <img src={image} className="w-[26rem]"/>
                </div>
                <div className="flex items-center justify-center max-lg:w-full">
                    <LoginForm />
                </div>
            </div>
        </AuthLayout>
    )
}