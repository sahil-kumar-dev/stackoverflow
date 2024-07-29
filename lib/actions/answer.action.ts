"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase()

        const { author, content, path, question } = params

        const newAnswer = await Answer.create({
            content, author, question
        })

        // add the answer to the question's answer array

        await Question.findByIdAndUpdate(question, {
            $push: { answers: newAnswer._id }
        })

        // Todo add interaction

        revalidatePath(path)

    } catch (error) {
        console.log(error)
    }
}

export async function getAnswers(params: GetAnswersParams) {
    try {
        connectToDatabase()

        const { questionId,sortBy } = params

        let sortOptions = {}

        switch (sortBy) {
            case "highestUpvotes":
                sortOptions = {upvotes:-1}
                break;
            case "lowestUpvotes":
                sortOptions = {downvotes:-1}
                break;
            case "recent":
                sortOptions = {createdAt:-1}
                break;
            case "old":
                sortOptions = {createdAt:1}
                break;
        
            default:
                break;
        }

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId name picture")
            .sort(sortOptions)

        return answers

    } catch (error) {
        console.log(error)
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase()

        const { hasdownVoted, hasupVoted, path, answerId, userId } = params

        let updateQuery = {}

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } }
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if (!answer) {
            throw new Error("Answer not found")
        }

        // Increment author reputation by +10 


        revalidatePath(path)


    } catch (error) {

    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase()

        const { hasdownVoted, hasupVoted, path, answerId, userId } = params

        let updateQuery = {}

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } }
        } else if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if (!answer) {
            throw new Error("Answer not found")
        }

        // Increment author reputation by +10 


        revalidatePath(path)


    } catch (error) {
        console.log(error)
    }
}

export async function deleteAnswer(params: DeleteAnswerParams){
    try{
        connectToDatabase()

        const {answerId, path} = params

        await Answer.findByIdAndDelete(answerId)

        await Interaction.deleteMany({answer:answerId})

        await Question.updateMany({answers:answerId},{$pull:{answers:answerId}})

        revalidatePath(path)

    }catch(error){
        console.log(error)
    }

}