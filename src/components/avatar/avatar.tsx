import { ImgHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants"
import defaultAvatar from "../../assets/default_avatar.png";

const avatarVariants = tv({
    base: 'rounded-full shrink-0',
    variants: {
        size: {
            sm: 'size-9',
            md: 'size-12',
            lg: 'size-24'
        },
        center: 'object-center object-cover'
    },
    defaultVariants: {
        size: 'md',
    }
});

export type AvatarProps = ImgHTMLAttributes<HTMLImageElement> &
    VariantProps<typeof avatarVariants>

export const Avatar = ({size, center, className, src, ...props} : AvatarProps) => {
    const [ loaded, setLoaded ] = useState(false);

    const handleLoaded = () => {
        setLoaded(true);
    }

    return (
        <div className={
            twMerge(avatarVariants({size, center}),
            !loaded ? 'bg-gray-600' : ''
        )
        } {...props}>
            <img src={src || defaultAvatar} onLoad={handleLoaded}/>
        </div>
    )
}