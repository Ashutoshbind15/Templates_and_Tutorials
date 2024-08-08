"use client";

import { redirect, useRouter } from "next/navigation";
import { Button } from "../uilib/ui/button";

// Define types for the props
interface PaginatorButtonProps {
  isActive: boolean;
  pageNumber: number;
}

interface PrevNextButtonProps {
  isActive: boolean;
  pageNumber: number;
  isPrev: boolean;
}

interface RepoPaginatorProps {
  totalPages: number;
  currentPage: number;
}

const PaginatorPageButton = ({
  isActive,
  pageNumber,
}: PaginatorButtonProps) => {
  const rtr = useRouter();

  return (
    <Button
      disabled={!isActive}
      onClick={() => {
        rtr.push(`/repo?page=${pageNumber}`);
      }}
    >
      {pageNumber}
    </Button>
  );
};

const PrevNextButton = ({
  isActive,
  pageNumber,
  isPrev,
}: PrevNextButtonProps) => {
  const rtr = useRouter();

  return (
    <Button
      disabled={!isActive}
      onClick={() => {
        rtr.push(`/repo?page=${pageNumber}`);
      }}
    >
      {isPrev ? "Prev" : "Next"}
    </Button>
  );
};

const RepoPaginator = ({ totalPages, currentPage }: RepoPaginatorProps) => {
  const pageNumbers = [];

  // Determine the range of page numbers to display
  const startPage = Math.max(1, currentPage - 3);
  const endPage = Math.min(totalPages, currentPage + 3);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      <PrevNextButton
        isActive={currentPage > 1}
        pageNumber={currentPage - 1}
        isPrev={true}
      />

      {startPage > 1 && (
        <>
          <PaginatorPageButton isActive={true} pageNumber={1} />
          <span>...</span>
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <PaginatorPageButton
          key={pageNumber}
          isActive={pageNumber !== currentPage}
          pageNumber={pageNumber}
        />
      ))}

      {endPage < totalPages && (
        <>
          <span>...</span>
          <PaginatorPageButton isActive={true} pageNumber={totalPages} />
        </>
      )}

      <PrevNextButton
        isActive={currentPage < totalPages}
        pageNumber={currentPage + 1}
        isPrev={false}
      />
    </div>
  );
};

export default RepoPaginator;
