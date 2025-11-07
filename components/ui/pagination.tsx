"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  lastVisiblePage: number;
  limit: number;
}

export function Pagination({
  currentPage,
  hasNextPage,
  lastVisiblePage,
  limit,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    return `?${params.toString()}`;
  };

  const hasPreviousPage = currentPage > 1;

  // Calculate page range to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    const startPage = Math.max(1, currentPage - halfRange);
    const endPage = Math.min(lastVisiblePage, startPage + maxPagesToShow - 1);

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < lastVisiblePage) {
      if (endPage < lastVisiblePage - 1) {
        pages.push("...");
      }
      pages.push(lastVisiblePage);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={!hasPreviousPage}
        className="gap-1"
      >
        {hasPreviousPage ? (
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
        )}
      </Button>

      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "outline"}
              size="sm"
              asChild={!isActive}
              disabled={isActive}
            >
              {isActive ? (
                <span>{pageNumber}</span>
              ) : (
                <Link href={createPageUrl(pageNumber)}>{pageNumber}</Link>
              )}
            </Button>
          );
        })}
      </div>

      <div className="sm:hidden flex items-center gap-2 px-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {lastVisiblePage}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={!hasNextPage}
        className="gap-1"
      >
        {hasNextPage ? (
          <Link href={createPageUrl(currentPage + 1)}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
