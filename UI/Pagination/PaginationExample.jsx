import React, { useState } from "react";
import { Pagination } from "../../UI/Pagination/Pagination";

export default function PaginationExample() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h3 style={{ margin: "8px 0" }}>Pagination demo</h3>
      <div>Current page: <strong>{page}</strong></div>
      <Pagination
        currentPage={page}
        totalPages={24}
        onPageChange={setPage}
        siblingCount={1}
        boundaryCount={1}
        showFirstLast
        showPrevNext
      />
    </div>
  );
}


