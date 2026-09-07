import "./HoverLineShow.css";

/**
 * Run-on list of client names, each growing an underline on hover.
 *
 * Ported from `UI/HoverLineShow/index.html` — the source is a static page, so
 * the markup is transcribed here rather than copied. The wipe is a `::after`
 * bar scaled on the X axis, with `transform-origin` flipped between hover and
 * unhover: it grows from the left going in and retracts to the right coming
 * out, instead of collapsing back the way it came.
 */

const clients = [
  "Native Instruments,",
  "Oura,",
  "Hender Scheme,",
  "B&O Play,",
  "Nothing,",
  "Gentle Monster,",
  "Officine Panerai,",
  "Polestar,",
  "Fragment Design,",
  "Superfuture,",
  "Bang & Olufsen,",
  "Sonos.",
];

export default function HoverLineShow() {
  return (
    <div className="clients-list">
      {clients.map((name) => (
        <div className="client-name" key={name}>
          <h1>{name}</h1>
        </div>
      ))}
    </div>
  );
}
