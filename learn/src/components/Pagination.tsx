interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
  }) => {
    return (
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}  // Disable if on the first page
        >
          Previous
        </button>
  
        <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
  
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}  // Disable if on the last page
        >
          Next
        </button>
      </div>
    );
  };
  
  
  export default Pagination;
  