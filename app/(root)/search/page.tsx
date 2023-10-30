import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUserPosts, fetchUsers } from "@/lib/actions/user.acions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import UserCard from "@/components/cards/UserCard";


const Page = async () => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);


    if (!userInfo?.onboarded) redirect("/onboarding");
    // fetch user by name

    // TODO: Fetch communities ❤️❤️
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
    });

    return (
        <section>
            <h1 className="headtext">Search</h1>
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result"> no users</p>
                ) : (
                    <>

                    {result.users.map((person) => (
                        <UserCard 
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            username={person.username}
                            imgUrl={person.image}
                            personType='User'
                        
                        />
                    ))}

                    </>
                )} 
            </div>
        </section>
    )
}

export default Page