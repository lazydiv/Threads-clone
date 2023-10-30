import { fetchUserPosts } from "@/lib/actions/user.acions"
import { redirect } from "next/navigation"
import Threadcard from "../cards/Threadcard"

interface Props {
    currentUserId: string,
    accountId: string,
    accountType: string,
}


const ThreadsTab = async ({
    currentUserId,
    accountId,
    accountType
} : Props) => {
    
    let result = await fetchUserPosts(accountId)
    // if(!result) redirect('/')

  return (
    <section className="mt-9 flex flex-col gap-10">
        {result.threads.map((thread: any) =>(
            <Threadcard
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
                accountType === 'User' 
                    ? {name : result.name, image: result.image, id: result.id}
                    : { name : thread.author.name, image: thread.author.image, id: thread.author.id}
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))}
    </section>
  )
}

export default ThreadsTab