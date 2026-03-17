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
	}, 500)

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
		<div className="relative w-full flex items-center">
			<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
			<Input
				disabled={disabled}
				ref={inputRef}
				value={inputValue}
				onChange={(e) => {
					const newValue = e.target.value
					setInputValue(newValue)
					if (newValue.length === 0 || newValue.length >= 3) {
						handleSearch(newValue)
					}
				}}
				className="h-12 w-full pl-11 pr-10 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-[#31404f] focus-visible:border-transparent"
				placeholder="Search by name, research interest, university..."
			/>
			{inputValue.length > 0 && (
				<Button
					className="absolute right-2 text-gray-400 rounded-full h-8 w-8"
					variant="ghost"
					type="reset"
					size="icon"
					onClick={resetQuery}
				>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	)
}
