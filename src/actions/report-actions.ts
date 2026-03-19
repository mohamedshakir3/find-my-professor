"use server"

import { createClient } from "@/utils/supabase/server"

export type ReportReason =
	| "wrong_data"
	| "outdated"
	| "missing_data"
	| "duplicate"
	| "other"

interface SubmitReportInput {
	professorId: number
	professorName: string
	reason: ReportReason
	details: string | null
}

export async function submitReport(input: SubmitReportInput) {
	const supabase = await createClient()

	// Check if a report already exists for this professor
	const { data: existing } = await supabase
		.from("reports")
		.select("id, report_count, details")
		.eq("professor_id", input.professorId)
		.single()

	if (existing) {
		// Append new details (if any) and bump the count
		const updatedDetails = [existing.details, input.details]
			.filter(Boolean)
			.join("\n---\n")

		const { error } = await supabase
			.from("reports")
			.update({
				report_count: existing.report_count + 1,
				details: updatedDetails || null,
				reason: input.reason,
			})
			.eq("id", existing.id)

		if (error) {
			console.error("Failed to update report:", error.message)
			return { success: false }
		}
	} else {
		const { error } = await supabase.from("reports").insert({
			professor_id: input.professorId,
			professor_name: input.professorName,
			reason: input.reason,
			details: input.details,
			report_count: 1,
		})

		if (error) {
			console.error("Failed to submit report:", error.message)
			return { success: false }
		}
	}

	return { success: true }
}
