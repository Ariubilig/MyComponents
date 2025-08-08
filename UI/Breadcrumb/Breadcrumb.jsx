import React from "react";
import "./Breadcrumb.css";
const cx = (...classes) => classes.filter(Boolean).join(" ");

export function Breadcrumb({
  items = [],
  separator = "/",
  className,
  "aria-label": ariaLabel = "Breadcrumb",
}) {
  const lastIndex = items.length - 1;
  return (
    <nav className={cx("breadcrumb", className)} aria-label={ariaLabel}>
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          const content = isLast ? (
            <span className="breadcrumb__current" aria-current="page">{item.label}</span>
          ) : item.href || item.onClick ? (
            <a
              className="breadcrumb__link"
              href={item.href || "#"}
              onClick={item.onClick}
            >
              {item.label}
            </a>
          ) : (
            <span className="breadcrumb__current">{item.label}</span>
          );

          return (
            <li key={index}>
              {content}
              {!isLast && <span className="breadcrumb__separator">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


