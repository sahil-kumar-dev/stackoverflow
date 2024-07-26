"use server"

import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import Question from "@/database/question.model"
import { createQuestionParams, getQuestionsParams } from "./shared.types"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"


export async function getQuestions(params: getQuestionsParams) {
    try {
        // connect to DB
        connectToDatabase()

        const questions = await Question.find({})
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort({createdAt:-1})

        return { questions }
    } catch (error) {
        console.log(error)
    }
}

export async function createQuestion(params: createQuestionParams) {
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
