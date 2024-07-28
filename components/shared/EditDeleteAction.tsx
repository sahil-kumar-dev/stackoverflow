"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, X } from "lucide-react";
import { Button } from "../ui/button";


interface Props {
	type: string;
	itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
	const pathname = usePathname();
	const router = useRouter();

	const handleEdit = () => {
		router.push(`/question/edit/${JSON.parse(itemId)}`)
	};

	const handleDelete = async () => {
		if (type === 'Question') {
			// Delete question
			await deleteQuestion({
				questionId: JSON.parse(itemId),
				path: pathname
			})
		} else if (type === 'Answer') {
			// Delete answer
			await deleteAnswer({
				answerId: JSON.parse(itemId),
				path: pathname
			})
		}
	};

	return (
		<div className="flex items-center justify-end gap-3 max-sm:w-full">
			{type === 'Question' && (
				<Image
					src="/assets/icons/edit.svg"
					alt="Edit"
					width={14}
					height={14}
					className="cursor-pointer object-contain"
					onClick={handleEdit}
				/>
			)}

			<AlertDialog>
				<AlertDialogTrigger>
					<Image
						src="/assets/icons/trash.svg"
						alt="Delete"
						width={14}
						height={14}
						className="cursor-pointer object-contain"

					/>
				</AlertDialogTrigger>
				<AlertDialogContent className="dark:bg-black bg-light-850">
					<AlertDialogHeader>
						<AlertDialogTitle>
							<h1 className="text-xl font-medium text-black dark:text-gray-100">Are you absolutely sure?</h1>
						</AlertDialogTitle>
						<AlertDialogDescription>
							<p className="text-sm text-gray-400">This action cannot be undone. This will permanently delete your account
								and remove your data from our servers.</p>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel >
							<button className="flex dark:text-white items-center">
								<span className="mr-2">
									<X />
								</span>
								Cancel
							</button>
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							<button className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-red-50 shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
								<span className="mr-2">
									<Trash2 />
								</span>
								Delete
							</button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>


		</div>
	)
}

export default EditDeleteAction