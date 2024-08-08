import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "../../components/form/FormInput";
import { Button } from "../../components/buttons/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io5";
import { useLoginMutation } from "../../app/api/auth/auth-api-slice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useGetAuthenticationQuery, useLazyGetAuthenticationQuery } from "../../app/api/user/user-api-slice";
import { useDispatch } from "react-redux";
import { logOut, setAuthenticatedUser } from "../../app/api/auth/auth-slice";

type LoginFormProps = {
    onSuccess: () => void;
}

const loginInputSchema = z.object({
    username: z.string().min(1, 'Email is required'),
    password: z.string().min(8, 'Invalid password')
})

type LoginInput = z.infer<typeof loginInputSchema>

export const LoginForm = () => {
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInput>({resolver: zodResolver(loginInputSchema)});

    const navigate = useNavigate();
    const [ searchPrams ] = useSearchParams();

    let redirectStr = searchPrams.get('redirectTo') || '';
    redirectStr = decodeURIComponent(redirectStr);

    const [ login ] = useLoginMutation();
    const [ getAuthentication ] = useLazyGetAuthenticationQuery();
    const dispatch = useDispatch();

    const onSubmit: SubmitHandler<LoginInput> = async (data) => {
        try {
            const token = await login(data).unwrap();

            if(token.data) {
                localStorage.setItem("accessToken", token.data.accessToken);
                localStorage.setItem("refreshToken", token.data.refreshToken);
                try {
                   var user = await getAuthentication().unwrap();

                   if(user.data) {
                        dispatch(setAuthenticatedUser(user.data));
                        navigate(`${redirectStr}`, {replace: true});
                   }
                } catch(e) {
                    dispatch(logOut())
                }
            }
        } catch(e) {
            console.log(e);
        }
    };

    return (
        <div className="flex">
            <form className="w-[28rem] bg-slate-100 rounded-2xl px-12 py-8 shrink-0" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label>Username</label>
                    <FormInput name="username" register={register} error={errors.username}className="mt-2 w-full"></FormInput>

                </div>

                <div>
                    <label>
                        Password
                    </label>
                    <FormInput 
                    type="password"
                    name="password" register={register}
                    error={errors.password}
                    className="mt-2 w-full">
                    </FormInput>
                </div>
                <Button variant="link" className="mt-2">Forgot password?</Button>

                <Button
                className="w-full mt-8"
                type="submit">Login</Button>
                <p className="font-medium m-8 text-center">OR LOGIN WITH</p>
                <div className="flex w-full justify-center gap-16">
                <Button type="button" className="px-8 py-3">
                    <FcGoogle />
                </Button>
                <Button type="button" className="px-8 py-3">
                    <IoLogoFacebook className="text-sky-500" />
                </Button>
                </div>

                <p className="mt-8 inline-block">Don't have an account</p>
                <Button variant="link" className="p-0 font-normal">&nbsp;Sign up</Button>
            </form>
        </div>
    )
}