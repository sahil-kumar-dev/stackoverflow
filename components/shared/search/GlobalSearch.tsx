'use client'

import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GlobalResult from './GlobalResult'

const GlobalSearch = () => {

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const query = searchParams.get('q');

	const [search, setSearch] = useState(query || '');

	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: 'global',
					value: search
				})

				router.push(newUrl, { scroll: false });
			} else {
				if (query) {
					const newUrl = removeKeysFromQuery({
						params: searchParams.toString(),
						keysToRemove: ['global','type']
					})

					router.push(newUrl, { scroll: false });
				}

			}
		}, 300);
	}, [search,router,pathname,searchParams,query])

	return (
		<div className='relative w-full max-w-[600px] max-lg:hidden'>
			<div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
				<Image
					src={'/assets/icons/search.svg'}
					alt='search'
					height={24}
					width={24}
					className='cursor-pointor'
				/>
				<Input
					type='text'
					placeholder='Search Globally'
					value={''}
					onChange={(e)=>{
						setSearch(e.target.value)

						if(!isOpen) setIsOpen(true)

						if(e.target.value === '' && isOpen) setIsOpen(false)
					}}
					className='paragraph-regular text-dark400_light700 no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none'
				/>
			</div>
			{
				isOpen && (
					<GlobalResult/>
				)
			}
		</div>
	)
}

export default GlobalSearch