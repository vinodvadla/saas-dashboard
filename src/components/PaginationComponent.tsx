// components/PaginationComponent.tsx
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
  interface PaginationComponentProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const PaginationComponent: React.FC<PaginationComponentProps> = ({
    currentPage,
    totalPages,
    onPageChange,
  }) => {
    if (totalPages <= 1) return null;
  
    return (
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={currentPage == 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
  
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  isActive={page == currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
  
            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(Number(currentPage) + 1);
                }}
                className={
                  currentPage == totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };
  
  export default PaginationComponent;