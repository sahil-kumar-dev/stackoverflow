import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import { getQuestions, getRecommendedQuestions } from '@/lib/actions/question.action'
import { SearchParamsProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'


export const metadata: Metadata = {
	title: 'Home | Dev Overflow',
	description: 'Welcome to Dev Overflow - Your go-to platform for all your coding questions and answers'
}

const Home = async ({ searchParams }: SearchParamsProps) => {

	const { userId } = auth()

	let result;

	if (searchParams.filter == 'recommended') {

		if (userId) {
			result = await getRecommendedQuestions({
				userId: userId!,
				searchQuery: searchParams.q,
				page: searchParams.page ? +searchParams.page : 1
			})
		} else {
			result = await getQuestions({
				searchQuery: searchParams.q,
				filter: searchParams.filter,
				page: searchParams.page ? +searchParams.page : 1
			})
		}
	} else {
		result = await getQuestions({
			searchQuery: searchParams.q,
			filter: searchParams.filter,
			page: searchParams.page ? +searchParams.page : 1
		})
	}


	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>All Quesiton</h1>
				<Link
					href='/ask-question'
					className='flex justify-end max-sm:w-full'
				>
					<Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
						Ask a Question
					</Button>
				</Link>
			</div>
			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearchbar
					route='/'
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					placeholder='Search questions'
				/>
				<Filter
					filters={HomePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px"
					containerClasses="hidden max-md:flex"
				/>
			</div>
			<HomeFilters />
			<div className="mt-10 flex w-full flex-col gap-6">
				{
					result!.questions.length > 0 ?
						result!.questions.map((question) => (
							<QuestionCard
								key={question._id}
								_id={question._id}
								title={question.title}
								author={question.author}
								tags={question.tags}
								upvotes={question.upvotes}
								answers={question.answers}
								views={question.views}
								createdAt={question.createdAt}
							/>
						)) : (
							<NoResult
								title={`There's no question to show`}
								description='Try different keywords or remove search filters to see all questions'
								link='/ask-question'
								linkTitle='Ask a Question'
							/>
						)
				}
			</div>
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	)
}

export default Home