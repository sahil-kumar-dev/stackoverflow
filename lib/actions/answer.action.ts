"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params:CreateAnswerParams){
    try {
        connectToDatabase()

        const {author,content,path,question} = params

        const newAnswer = await Answer.create({
            content,author,question
        })

        // add the answer to the question's answer array

        await Question.findByIdAndUpdate(question,{
            $push:{answer:newAnswer._id}
        })

        // Todo add interaction

        revalidatePath(path)

    } catch (error) {
        console.log(error)
    }
}


export async function getAnswers(params:GetAnswersParams){
    try {
        connectToDatabase()

        const {questionId} = params

        const answers = await Answer.find({question:questionId})
                        .populate("author","_id clerkId name picture")
                        .sort({createdAt:-1})
        
        return answers

    } catch (error) {
        console.log(error)
    }
}