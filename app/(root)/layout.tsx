import LeftSidebar from '@/components/shared/LeftSidebar'
import Navbar from '@/components/shared/Navbar/Navbar'
import RightSidebar from '@/components/shared/RightSidebar'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className='background-light850_dark100 relative'>
            <Navbar/>
            <div className="flex">
                <LeftSidebar/>
                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
                    <div className="max-auto w-full max-w-5xl">
                        {children}
                    </div>
                </section>
                <RightSidebar/>
            </div>
            <Toaster />
        </div>
    )
}

export default layout