import {
	ClerkProvider
} from '@clerk/nextjs'
import './globals.css'
import '@/styles/prism.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeProvider'
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800', '900'],
	variable: '--font-inter',
})

const space_grotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-space-grotesk',
})


export const metadata: Metadata = {
	title: 'Devflow',
	description: 'A community-driven platfrom for asking and answering programming questions. Get help, share knowledge, and collaborate with other developers from around the world. Explore topics in web development, mobile app development, software engineering, and more. Join the conversation and make a positive impact on the tech industry.',
	icons: {
		icon: '/assets/images/site-logo.svg',
	}
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={` ${space_grotesk.className}`}>
				<NextTopLoader
					showSpinner={false}
					color='#ff7000'
				/>
				<ClerkProvider
					appearance={{
						elements: {
							formButtonPrimary: 'primary-gradient',
							footerActionLink:
								'primary-text-gradient hover:text-primary-500'
						}
					}}
				>
					<ThemeProvider>
						{children}
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	)
}