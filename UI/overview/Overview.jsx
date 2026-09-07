import { useState } from "react";

import "./Overview.css";

/* Hoisted to module scope: hovering a row sets state, and rebuilding eight
 * object literals on every one of those renders is work for nothing. The list
 * is constant, so it never needs to be rebuilt at all.
 *
 * `time` holds real non-breaking spaces (\u00a0) rather than `&nbsp;` entities
 * pushed through `dangerouslySetInnerHTML`. Same glyphs, no raw-HTML sink in a
 * component that only ever renders text. */
const projects = [
  { title: "Azure Serenity", category: "Commercial", time: `53"`, year: 2021 },
  {
    title: "Crimson Symphony Memoirs",
    category: "Music",
    time: `03' \u00a0\u00a0\u00a0\u00a0\u00a0 17"`,
    year: 2017,
  },
  {
    title: "Velvet Dreamscape",
    category: "Narrative",
    time: `02' \u00a0\u00a0\u00a0\u00a0\u00a0 42"`,
    year: 2020,
  },
  { title: "Azure Serenity", category: "Commercial", time: `53"`, year: 2021 },
  {
    title: "Crimson Symphony Memoirs",
    category: "Music",
    time: `03' \u00a0\u00a0\u00a0\u00a0\u00a0 17"`,
    year: 2017,
  },
  {
    title: "Velvet Dreamscape",
    category: "Narrative",
    time: `02' \u00a0\u00a0\u00a0\u00a0\u00a0 42"`,
    year: 2020,
  },
  {
    title: "Crimson Symphony Memoirs",
    category: "Music",
    time: `03' \u00a0\u00a0\u00a0\u00a0\u00a0 17"`,
    year: 2017,
  },
  {
    title: "Velvet Dreamscape",
    category: "Narrative",
    time: `02' \u00a0\u00a0\u00a0\u00a0\u00a0 42"`,
    year: 2020,
  },
];

const Overview = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="overview-page">
        <div className="table">
          <div className="t-row" id="table-header">
            <div className="index">
              <p>#</p>
            </div>
            <div className="title">
              <p>Title</p>
            </div>
            <div className="category">
              <p>Category</p>
            </div>
            <div className="time">
              <p>Running Time</p>
            </div>
            <div className="year">
              <p>Year</p>
            </div>
          </div>

          {projects.map((project, index) => (
            <div
              className={`t-row ${
                hoveredIndex !== null && index !== hoveredIndex
                  ? "not-hovered"
                  : ""
              }`}
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="index">
                <p>0{index + 1}</p>
              </div>
              <div className="title">
                <p>{project.title}</p>
              </div>
              <div className="category">
                <p>{project.category}</p>
              </div>
              <div className="time">
                <p>{project.time}</p>
              </div>
              <div className="year">
                <p>{project.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview;
