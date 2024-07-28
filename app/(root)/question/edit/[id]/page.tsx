import Question from '@/components/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({params}:{params:{id:string}}) => {

    const {userId} = auth()

    if(!userId) {
        return redirect('/')
    }

    const mongoUserId = await getUserById({userId})

    console.log('mongouser',mongoUserId)
    const result = await getQuestionById({questionId:params.id})

    return (
        <div>
            <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>
            <div className="mt-9">
                <Question
                    type='edit'
                    mongoUserId={mongoUserId._id}
                    questionDetails={JSON.stringify(result)}
                />
            </div>
        </div>
    )
}

export default page