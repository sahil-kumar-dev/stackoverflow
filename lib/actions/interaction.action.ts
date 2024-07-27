"use server"

import Question from "@/database/question.model";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
    const { questionId, userId } = params;

    try {
        if (userId) {
            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: "view",
                question: questionId
            })

            if (existingInteraction) {
                console.log('use already viewed')
                return
            } else {
                await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })
            }
        }
    } catch (error) {
        console.log(error)
    }
}