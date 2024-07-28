"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import { FilterQuery } from 'mongoose'
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import Answer from "@/database/answer.model"

export async function getUserById(params: any) {
    try {
        connectToDatabase()

        const { userId } = params

        const user = await User.findOne({ clerkId: userId })

        return user

    } catch (error) {
        console.log(error)
    }
}

export async function createUser(userParams: CreateUserParams) {
    try {
        connectToDatabase()

        const newUser = await User.create(userParams)

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function updateUser(userParams: UpdateUserParams) {
    try {
        connectToDatabase()
        const { clerkId, updateData, path } = userParams
        await User.findOneAndUpdate({ clerkId }, updateData, {
            new: true
        })

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function deleteUser(userParams: DeleteUserParams) {
    try {
        connectToDatabase()

        const { clerkId } = userParams

        const user = await User.findOneAndDelete({ clerkId })

        // delete user from database

        // like question answer

        const userQuestionsIds = await Question.find({ autor: user._id })
            .distinct('_id')

        await Question.deleteMany({ author: user._id })

        // delete user answer and more

        const deletedUser = await User.findByIdAndDelete(user._id)

        return deletedUser

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase()

        const { searchQuery, filter, page = 1, pageSize = 20 } = params

        const users = await User.find({})
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ createdAt: -1 })

        return { users }

    } catch (error) {
        console.log(error)
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase()

        const { questionId, userId, path } = params

        const user = await User.findOne({ _id: userId })


        if (user.saved.includes(questionId)) {
            await User.findByIdAndUpdate(user._id, {
                $pull: { saved: questionId }
            }, { new: true })
        } else {
            await User.findByIdAndUpdate(user._id, {
                $push: { saved: questionId }
            }, { new: true })
        }

        revalidatePath(path)

    } catch (error: any) {
        console.log(error.message)
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        connectToDatabase()

        const { clerkId, filter, searchQuery, page = 1, pageSize = 10 } = params

        const query: FilterQuery<typeof Question> = searchQuery
            ? {
                title: {
                    $regex: new RegExp(searchQuery, 'i')
                }
            } : {}

        const user = await User.findOne({ clerkId })
            .populate({
                path: 'saved',
                match: query,
                model: Question,
                select: '_id title createdAt tags',
                options: {
                    sort: {
                        createdAt: -1
                    }
                },
                populate: [
                    { path: 'tags', model: Tag, select: "_id name" },
                    { path: 'author', model: User, select: '_id clerkId name picture' }
                ]
            })


        if (!user) {
            throw new Error('User not found')
        }

        return {
            questions: user.saved
        }
    }

    catch (error) {
        console.log(error)
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase()

        const { userId } = params

        const user = await User.findOne({ clerkId: userId })

        if(!user) {
            throw new Error('User not found')
        }

        const totalQuestions = await Question.countDocuments({ autor: user._id })

        const totalAnswers = await Answer.countDocuments({ autor: user._id })

        return {
            user,
            totalQuestions,
            totalAnswers
        }

    }catch(error) {
        console.log(error)
    }
}