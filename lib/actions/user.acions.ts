
"use server"

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { Error, FilterQuery, SortOrder } from "mongoose";


interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}


export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User
      .findOne({ id: userId })
    // .populate({
    //   path: 'commmunities'
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`faild to fetch user: ${error.message}`)
  }
}


export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error: any) {
    throw error;
  }
}




export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc'
} : {
  userId: string,
  searchString?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: SortOrder,
}) {  
  try {
      connectToDB();

      const skipAmount = (pageNumber - 1) * pageSize;

      const regex = new RegExp(searchString, 'i');

      const query: FilterQuery<typeof User> = {
        id: { $ne: userId }
      }

      if(searchString.trim() !== '') {
        query.$or = [
          {username: {$regex: regex}},
          {name: {$regex: regex}}
        ]
      }

      const sortOptions = {createdAt: sortBy};

      const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)
      
      const totalUsersCount = await User.countDocuments(query);
      const users = await usersQuery.exec();

      const isNext = totalUsersCount > skipAmount + users.length;

      return {users, isNext}
  } catch (error: any) {
      throw new Error(`faild to fetch users : ${error.message}`)
  }

}





export async function getActivity( userId:string ) {
 try {
  connectToDB();
  
  const userThreads = await Thread.find({ author: userId})


  const childThreadIds = userThreads.reduce((acc, userThreads) => {
    return acc.concat(userThreads.children)
  }, [])

  const replies = await Thread.find({
    _id: {$in: childThreadIds},
    author: {$ne: userId}
  }).populate({
    path: 'author',
    model: User,
    select: 'name image _id'
  })
  return replies
 } catch(error: any) {
  throw new Error(`unable to fetch activity: ${error.message}`)
 }
}