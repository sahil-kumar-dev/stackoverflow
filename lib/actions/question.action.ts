"use server"

import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "./shared.types"


export async function getQuestions(params: GetQuestionsParams) {
    try {
        // connect to DB
        connectToDatabase()

        const questions = await Question.find({})
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort({ createdAt: -1 })

        return { questions }
    } catch (error) {
        console.log(error)
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        // connect to DB
        connectToDatabase()

        const { title, content, tags, author, path } = params

        // create question

        const tagDocuments = []

        const question = await Question.create({
            title,
            content,
            author
        })

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`) } },
                { $setOnInsert: { name: tag }, $push: { question: question._id } },
                { upsert: true, new: true }
            )

            tagDocuments.push(existingTag._id)
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: {
                tags: {
                    $each: tagDocuments
                }
            }
        })

        revalidatePath(path)

        // increament author reputation


    } catch (error) {
        // handle error
    }
}


export async function getHotQuestions() {
    try {
        connectToDatabase()

        const hotQuestion = await Question.find({})
            .sort({ views: -1, upvotes: -1 })
            .limit(5)

        return hotQuestion

    } catch (error) {
        // handle error 
        console.log(error)
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDatabase()

        const { questionId } = params

        const question = await Question.findById(questionId)
            .populate({ path: 'tags', model: Tag, select: '_id name' })
            .populate({ path: 'author', model: User, select: '_id clearkId name picture' })

        return question

    } catch (error) {

    }
}