"use client"

import { useState } from "react"
import { Flag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { submitReport, type ReportReason } from "@/actions/report-actions"

const reasons: { value: ReportReason; label: string }[] = [
	{ value: "wrong_data", label: "Wrong data" },
	{ value: "outdated", label: "Outdated info" },
	{ value: "missing_data", label: "Missing data" },
	{ value: "duplicate", label: "Duplicate entry" },
	{ value: "other", label: "Other" },
]

interface ReportButtonProps {
	professorId: number
	professorName: string
}

export function ReportButton({ professorId, professorName }: ReportButtonProps) {
	const [open, setOpen] = useState(false)
	const [reason, setReason] = useState<ReportReason | null>(null)
	const [details, setDetails] = useState("")
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async () => {
		if (!reason) return
		setSubmitting(true)
		try {
			const result = await submitReport({
				professorId,
				professorName,
				reason,
				details: details.trim() || null,
			})
			if (result.success) {
				toast("Report submitted. Thanks for helping improve our data!")
				setOpen(false)
				setReason(null)
				setDetails("")
			} else {
				toast("Failed to submit report. Please try again.")
			}
		} catch {
			toast("Failed to submit report. Please try again.")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					className="text-gray-400 hover:text-[#e35535] transition-colors p-1 rounded-md hover:bg-gray-100"
					aria-label="Report incorrect data"
				>
					<Flag className="h-3.5 w-3.5" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-72">
				<div className="p-3 space-y-3">
					<div>
						<h3 className="font-medium text-sm text-gray-900">Report an issue</h3>
						<p className="text-xs text-gray-500 mt-0.5">
							What&apos;s wrong with this listing?
						</p>
					</div>

					<fieldset className="space-y-1.5">
						{reasons.map((r) => (
							<label
								key={r.value}
								className="flex items-center gap-2 text-sm cursor-pointer"
							>
								<input
									type="radio"
									name="reason"
									value={r.value}
									checked={reason === r.value}
									onChange={() => setReason(r.value)}
									className="accent-[#31404f]"
								/>
								{r.label}
							</label>
						))}
					</fieldset>

					<div className="space-y-1">
						<Label htmlFor="report-details" className="text-xs text-gray-500">
							Details (optional)
						</Label>
						<textarea
							id="report-details"
							value={details}
							onChange={(e) => setDetails(e.target.value)}
							placeholder="Describe the issue..."
							rows={2}
							maxLength={500}
							className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#31404f] resize-none"
						/>
					</div>

					<Button
						size="sm"
						className="w-full bg-[#31404f] hover:bg-[#31404f]/90 text-white"
						disabled={!reason || submitting}
						onClick={handleSubmit}
					>
						{submitting ? (
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
						) : (
							"Submit Report"
						)}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
