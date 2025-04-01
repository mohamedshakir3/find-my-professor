"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
}: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  const handlePageChange = (pageNumber: number) => {
    router.push(createPageURL(pageNumber))
  }

  const getPageNumbers = () => {
    const pageNumbers = []

    pageNumbers.push(1)

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    if (startPage > 2) {
      pageNumbers.push("ellipsis-start")
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis-end")
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col items-center bg-gray-50 space-y-2">
      <div className="text-sm text-muted-foreground">
        Showing {totalItems > 0 ? (currentPage - 1) * 20 + 1 : 0} to{" "}
        {Math.min(currentPage * 20, totalItems)} of {totalItems} professors
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              onClick={(e) => {
                if (currentPage > 1) {
                  e.preventDefault()
                  handlePageChange(currentPage - 1)
                }
              }}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, i) => (
            <PaginationItem key={`page-${i}`}>
              {page === "ellipsis-start" || page === "ellipsis-end" ? (
                <span className="px-4 py-2">...</span>
              ) : (
                <PaginationLink
                  href={createPageURL(page as number)}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page as number)
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              onClick={(e) => {
                if (currentPage < totalPages) {
                  e.preventDefault()
                  handlePageChange(currentPage + 1)
                }
              }}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
