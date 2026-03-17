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

	const { error } = await supabase.from("reports").insert({
		professor_id: input.professorId,
		professor_name: input.professorName,
		reason: input.reason,
		details: input.details,
	})

	if (error) {
		console.error("Failed to submit report:", error.message)
		return { success: false }
	}

	return { success: true }
}
