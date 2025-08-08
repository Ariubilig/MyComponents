import React from "react";
import "./Pagination.css";
const cx = (...classes) => classes.filter(Boolean).join(" ");

function createRange(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => start + idx);
}

function usePagination({ currentPage, totalPages, siblingCount, boundaryCount }) {
  const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;

  if (totalPageNumbers >= totalPages) {
    return createRange(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2 + boundaryCount;
  const showRightEllipsis = rightSiblingIndex < totalPages - (1 + boundaryCount);

  const firstPages = createRange(1, boundaryCount);
  const lastPages = createRange(totalPages - boundaryCount + 1, totalPages);
  const middlePages = createRange(leftSiblingIndex, rightSiblingIndex);

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = createRange(1, rightSiblingIndex + (boundaryCount - 1));
    return [...leftRange, "ELLIPSIS", ...lastPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = createRange(leftSiblingIndex - (boundaryCount - 1), totalPages);
    return [...firstPages, "ELLIPSIS", ...rightRange];
  }

  return [...firstPages, "ELLIPSIS", ...middlePages, "ELLIPSIS", ...lastPages];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Pagination",
}) {
  const safeCurrent = Math.min(Math.max(1, currentPage || 1), Math.max(1, totalPages || 1));
  const pages = usePagination({ currentPage: safeCurrent, totalPages, siblingCount, boundaryCount });

  const goToPage = (page) => {
    if (disabled) return;
    if (page < 1 || page > totalPages) return;
    if (page === safeCurrent) return;
    onPageChange?.(page);
  };

  const renderPage = (page, index) => {
    if (page === "ELLIPSIS") {
      return (
        <li key={`e-${index}`} className="pagination__ellipsis" aria-hidden>
          …
        </li>
      );
    }

    const isActive = page === safeCurrent;
    return (
      <li key={page}>
        <button
          type="button"
          className={cx("pagination__button", isActive && "pagination__button--active")}
          onClick={() => goToPage(page)}
          aria-current={isActive ? "page" : undefined}
          aria-label={`Page ${page}`}
          disabled={disabled}
        >
          {page}
        </button>
      </li>
    );
  };

  return (
    <nav className={cx("pagination", className)} aria-label={ariaLabel}>
      {showFirstLast && (
        <button
          type="button"
          className="pagination__button"
          onClick={() => goToPage(1)}
          disabled={disabled || safeCurrent === 1}
          aria-label="First page"
        >
          «
        </button>
      )}
      {showPrevNext && (
        <button
          type="button"
          className="pagination__button"
          onClick={() => goToPage(safeCurrent - 1)}
          disabled={disabled || safeCurrent === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
      )}

      <ol className="pagination__list">
        {pages.map((p, idx) => renderPage(p, idx))}
      </ol>

      {showPrevNext && (
        <button
          type="button"
          className="pagination__button"
          onClick={() => goToPage(safeCurrent + 1)}
          disabled={disabled || safeCurrent === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      )}
      {showFirstLast && (
        <button
          type="button"
          className="pagination__button"
          onClick={() => goToPage(totalPages)}
          disabled={disabled || safeCurrent === totalPages}
          aria-label="Last page"
        >
          »
        </button>
      )}
    </nav>
  );
}


