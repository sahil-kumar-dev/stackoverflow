"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import { pathToFileURL } from "url"
import Question from "@/database/question.model"

export async function getUserById(params:any){
    try {
        connectToDatabase()

        const {userId} = params

        const user = await User.findOne({clerkId: userId})

        return user

    } catch (error) {
        console.log(error)
    }
}

export async function createUser(userParams:CreateUserParams){
    try {
        connectToDatabase()

        const newUser = await User.create(userParams)

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function updateUser(userParams:UpdateUserParams){
    try {
        connectToDatabase()
        const {clerkId,updateData,path} = userParams
        await User.findOneAndUpdate({clerkId},updateData,{
            new:true
        })

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function deleteUser(userParams:DeleteUserParams){
    try {
        connectToDatabase()
        
        const {clerkId} = userParams

        const user = await User.findOneAndDelete({clerkId})

        // delete user from database

        // like question answer

        const userQuestionsIds = await Question.find({autor:user._id})
            .distinct('_id')

        await Question.deleteMany({author:user._id})

        // delete user answer and more

        const deletedUser = await User.findByIdAndDelete(user._id)

        return deletedUser

    } catch (error) {
        console.log(error)
        throw error
    }
}