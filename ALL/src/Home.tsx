import "./Home.css";
import { Link } from "react-router-dom";
import { testsByGroup } from "./tests";

/** The index: every test route, listed straight off the registry. */
export default function Home() {
  return (
    <div className="harness">
      <header className="harness__head">
        <h1>components</h1>
        <p>
          Test pages for the components in this repo. To add one, drop the
          folder in <code>src/</code> and add an entry to{" "}
          <code>src/tests.ts</code> — the route and this list both come from
          there.
        </p>
      </header>

      {testsByGroup().map(([group, tests]) => (
        <section className="harness__group" key={group}>
          <h2>{group}</h2>
          <ul className="harness__list">
            {tests.map((test) => (
              <li key={test.path}>
                <Link to={`/${test.path}`} className="harness__item">
                  <span className="harness__title">{test.title}</span>
                  <span className="harness__blurb">{test.blurb}</span>
                  <code className="harness__source">{test.source}</code>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
