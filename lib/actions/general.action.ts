"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const SearchaleTyeps = ['question', 'answer', 'user', 'tag']

export async function globalSearch(params: SearchParams) {
    try {
        connectToDatabase()

        const { query, type } = params

        const regexQuery = {
            $regex: query, $options: "i"
        }

        let results : Array<object> = []

        const modelsAndTypes = [
            { model: Question, searchField: 'title', type: 'question' },
            { model: User, searchField: 'name', type: 'user' },
            { model: Answer, searchField: 'content', type: 'answer' },
            { model: Tag, searchField: 'name', type: 'tag' },
        ]

        const typeLower = type?.toLowerCase()

        if (!typeLower || !SearchaleTyeps.includes(typeLower)) {
            // search for everything

            // for (const {model,searchField,type} of modelsAndTypes) {
            //     const queryResults = await model.find({[searchField]:regexQuery}).limit(2)
            //     results.push(...queryResults.map((item)=>({
            //         title:type == 
            //     })))
            // }


        } else {
            // search int he specifited moded

            const modelInfo = modelsAndTypes.find((item) => item.type == type)

            if (!modelInfo) {
                throw new Error('Invalid search type')
            }

            const queryResults = await modelInfo.model.find({ [modelInfo.searchField]: regexQuery }).limit(8)

            results = queryResults.map((item) => ({
                title: type == 'answer' ? `Answer containing ${query}` : item[modelInfo.searchField],
                type,
                id: type == 'user' ? item.clerkId : type == 'answer' ? item.question : item._id
            }))
        }

        return JSON.stringify(results)

    } catch (error) {
        console.log(error)
    }
}