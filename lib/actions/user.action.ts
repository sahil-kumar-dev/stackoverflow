"use server"

import { connectToDatabase } from "../mongoose"
import User from "@/database/user.model"

export async function getUserById(params){
    try {
        connectToDatabase()

        const {userId} = params

        const user = await User.findOne({clerkId: userId})

        return user

    } catch (error) {
        console.log(error)
    }
}