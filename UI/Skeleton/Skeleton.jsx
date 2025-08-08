import React from "react";
import "./Skeleton.css";
const cx = (...classes) => classes.filter(Boolean).join(" ");


export function Skeleton({
  variant = "rect",
  width,
  height,
  lines = 1,
  animate = true,
  className,
  style,
}) {
  const baseClass = cx(
    "skeleton",
    animate && "skeleton--pulse",
    variant === "text" && "skeleton--text",
    variant === "circle" && "skeleton--circle",
    className
  );

  if (variant === "text" && lines > 1) {
    return (
      <div className="skeleton-lines" style={style}>
        {Array.from({ length: lines }).map((_, index) => (
          <span
            key={index}
            className={baseClass}
            style={{
              width: width || "100%",
              height: height || "1em",
              opacity: index === lines - 1 ? 0.7 : 1,
            }}
          />
        ))}
      </div>
    );
  }

  const inlineStyle = {
    width,
    height: height || (variant === "text" ? "1em" : undefined),
    ...style,
  };

  return <span className={baseClass} style={inlineStyle} />;
}