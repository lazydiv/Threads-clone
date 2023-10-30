"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image'
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";
interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string
}

const Comment = ({ threadId , currentUserImg, currentUserId} : Props) => {
  
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

    form.reset()
  };

  
  return (
    <Form {...form}>
      <form
        className='comment-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image 
                  src={currentUserImg}
                  alt="profile image"
                  width={48}
                  className="rounded-full mt object-cover"
                  height={48}
                />
              </FormLabel>
              <FormControl className='no-focus border-none bg-transparent  border-dark-4 bg-dark-3 text-light-1'>
                <Input placeholder="Comment ..." className="no-focus text-light-1 outline-none"  {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment