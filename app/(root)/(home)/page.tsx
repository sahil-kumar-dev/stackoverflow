import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'
import React from 'react'

const Home = () => {

	const questions: Array<object> = [
		{
			_id: "1",
			title: "What is React?",
			tags: [
				{ _id: "t1", name: "React" },
				{ _id: "t2", name: "JavaScript" }
			],
			author: {
				_id: "a1",
				name: "John Doe",
				picture: "/assets/images/avatar.png",
				clerkId: "c1"
			},
			upvotes: ["u1", "u2", "u3"],
			views: 150,
			answers: [],
			createdAt: new Date("2023-07-01"),
			clerkId: "c1"
		},
		{
			_id: "2",
			title: "How to use Next.js?",
			tags: [
				{ _id: "t3", name: "Next.js" },
				{ _id: "t2", name: "JavaScript" }
			],
			author: {
				_id: "a2",
				name: "Jane Smith",
				picture: "/assets/images/avatar.png",
				clerkId: "c2"
			},
			upvotes: ["u1", "u4"],
			views: 200,
			answers: [{}], // Assuming at least one answer object
			createdAt: new Date("2023-07-05"),
			clerkId: "c2"
		},
		{
			_id: "3",
			title: "What is the difference between JavaScript and TypeScript?",
			tags: [
				{ _id: "t2", name: "JavaScript" },
				{ _id: "t4", name: "TypeScript" }
			],
			author: {
				_id: "a3",
				name: "Alice Johnson",
				picture: "/assets/images/avatar.png",
				clerkId: "c3"
			},
			upvotes: ["u2", "u5"],
			views: 250,
			answers: [{}], // Assuming at least one answer object
			createdAt: new Date("2023-07-10"),
			clerkId: "c3"
		}
	];

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
					questions.length > 0 ?
						questions.map((question) => (
							<QuestionCard
								{...question}
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
				Question Card
			</div>
		</>
	)
}

export default Home