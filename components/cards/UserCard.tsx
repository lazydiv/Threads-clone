"use client"


import Image from "next/image"
import { Button } from "../ui/button"

import  { useRouter } from "next/navigation"
interface Props {
    id: string,
    username: string,
    name: string,
    imgUrl: string,
    personType: string
}


const UserCard = ({
    id,
    name,
    username,
    imgUrl,
    personType,
}: Props) => {

    const router = useRouter()
    return (
        <div>
            <article className="user-card">
                <div className="user-card_avatar">
                    <Image
                        alt="avatar"
                        src={imgUrl}
                        height={48}
                        width={48}
                        className="rounded-[200px] "

                    />
                    <div className="flex-1 text-ellipsis">

                        <h4 className="text-base-semibold text-light-1">
                            {name}
                        </h4>
                        <p className="text-small text-gray-1">@{username}</p>


                    </div>
                </div>
                <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
                    View
                </Button>
            </article>
        </div>
    )
}

export default UserCard