"use server"

import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import Question from "@/database/question.model"

export async function createQuestion(params:any){
    try {
        // connect to DB
        connectToDatabase()

        const {title,content,tags,author,path} = params

        // create question

        const tagDocuments = []

        const question = await Question.create({
            title,
            content,
            author
        })

        for(const tag of tags){
            const existingTag = await Tag.findOneAndUpdate(
                {name:{$regex:new RegExp(`^${tag}$`)}},
                {$setOnInsert:{name:tag},$push:{question:question._id}},
                {upsert:true,new:true}
            )

            tagDocuments.push(existingTag._id)
        }

        await Question.findByIdAndUpdate(question._id,{
            $push:{
                tags:{
                    $each:tagDocuments
                }
            }
        })

        // increament author reputation
        

    } catch (error) {
        // handle error
    }
}