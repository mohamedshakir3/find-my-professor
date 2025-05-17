"use client"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import { useSharedTransition } from "@/hooks/use-shared-transition"

export function SearchBox({
	query,
	disabled,
}: {
	query?: string | null
	disabled?: boolean
}) {
	const { startTransition } = useSharedTransition()
	const inputRef = useRef<HTMLInputElement>(null)
	const [isValid, setIsValid] = useState(true)
	const [inputValue, setInputValue] = useState(query || "")

	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		if (query !== undefined && query !== null) {
			setInputValue(query)
			if (inputRef.current) {
				inputRef.current.value = query
			}
		}
	}, [query])

	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams.toString())

		if (term) {
			params.set("q", term)
		} else {
			params.delete("q")
		}

		startTransition &&
			startTransition(() => {
				router.push(`${pathname}?${params.toString()}`)
			})
	}, 300)

	const resetQuery = () => {
		setInputValue("")
		startTransition &&
			startTransition(() => {
				router.push(pathname)
				if (inputRef.current) {
					inputRef.current.value = ""
					inputRef.current?.focus()
				}
			})
	}

	return (
		<>
			<div className="relative flex items-center space-x-2">
				<div className="relative w-full flex items-center">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
					<Input
						disabled={disabled}
						ref={inputRef}
						value={inputValue}
						minLength={3}
						onChange={(e) => {
							const newValue = e.target.value
							setInputValue(newValue)

							if (newValue.length > 2) {
								setIsValid(true)
								handleSearch(newValue)
							} else if (newValue.length === 0) {
								handleSearch(newValue)
								setIsValid(false)
							} else {
								setIsValid(false)
							}
						}}
						className={
							"text-base w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
						}
						placeholder="Search professors by name, research interest, university..."
					/>
					{inputValue.length > 0 ? (
						<Button
							className="absolute right-2 text-gray-400 rounded-full h-8 w-8"
							variant="ghost"
							type="reset"
							size={"icon"}
							onClick={resetQuery}
						>
							<X height="20" width="20" />
						</Button>
					) : null}
				</div>
			</div>
			{!isValid ? (
				<span className="text-xs pt-2 text-destructive">
					Query must be 3 characters or longer
				</span>
			) : (
				<span className="h-6" />
			)}
		</>
	)
}
