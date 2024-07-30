'use client'

import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action'
import { toggleSaveQuestion } from '@/lib/actions/user.action'
import { formatAndDivideNumber } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from '../ui/use-toast'

interface Props {
    type: string,
    itemId: string,
    userId: string,
    upvotes: number,
    hasupVoted: boolean,
    downvotes: number,
    hasdownVoted: boolean,
    hasSaved: boolean
}

const Vote = ({
    type,
    itemId,
    downvotes,
    hasSaved,
    hasdownVoted,
    hasupVoted,
    upvotes,
    userId
}: Props) => {

    const pathname = usePathname()
    const router = useRouter()

    const handleSave = async () => {
        await toggleSaveQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname
        })

        return toast({
            title: `Question ${!hasSaved ? 'Saved' : 'Unsaved'}`,
            variant: !hasSaved ? 'default' : 'destructive'
        });
    }

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined
        })
    }, [itemId, userId, pathname, router])

    const handleVote = async (action: string) => {
        if (!userId) {
            return toast({
                title: 'Please log in',
                description: 'You must be logged in to perform this action'
            });
        }

        if (action == 'upvote') {
            if (type === 'Question') {
                await upvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            } else if (type == 'Answer') {
                await upvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            }

            return toast({
                title: `Upvote ${!hasupVoted ? 'Successfully' : 'Removed'}`,
                variant: !hasupVoted ? 'default' : 'destructive'
            });
            // show a toast

        }
        if (action == 'downvote') {
            if (type === 'Question') {
                await downvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            } else if (type == 'Answer') {
                await downvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            }

            // show a toast
            return toast({
                title: `Upvote ${!hasdownVoted ? 'Successfully' : 'Removed'}`,
                variant: !hasdownVoted ? 'default' : 'destructive'
            });
        }
    }

    return (
        <div className='flex gap-5'>
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image
                        src={hasupVoted
                            ? '/assets/icons/upvoted.svg'
                            : '/assets/icons/upvote.svg'
                        }
                        height={18}
                        width={18}
                        alt='upvode'
                        className='cursor-pointer'
                        onClick={() => { handleVote('downvote') }}
                    />

                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className='subtle-medium text-dark400_light900'>
                            {formatAndDivideNumber(upvotes)}
                        </p>
                    </div>
                </div>
                <div className="flex-center gap-1.5">
                    <Image
                        src={hasdownVoted
                            ? '/assets/icons/downvoted.svg'
                            : '/assets/icons/downvote.svg'
                        }
                        height={18}
                        width={18}
                        alt='upvode'
                        className='cursor-pointer'
                        onClick={() => { handleVote('upvote') }}
                    />

                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className='subtle-medium text-dark400_light900'>
                            {formatAndDivideNumber(downvotes)}
                        </p>
                    </div>
                </div>
            </div>
            {
                type === 'Question' &&
                <Image
                    src={hasSaved
                        ? '/assets/icons/star-filled.svg'
                        : '/assets/icons/star-red.svg'
                    }
                    height={18}
                    width={18}
                    alt='star'
                    className='cursor-pointer'
                    onClick={handleSave}
                />
            }
        </div>
    )
}

export default Vote