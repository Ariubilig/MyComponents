import "./App.css";
import { useRef } from "react";
import MediaBetweenText from "./MediaBetweenText";
import type { MediaBetweenTextRef } from "./MediaBetweenText";

/** Every trigger `MediaBetweenText` supports, in one page. */
export default function App() {
  const manual = useRef<MediaBetweenTextRef>(null);

  return (
    <div className="App mbt-demo">
      {/* Default: the gap opens while the pointer is over the line. */}
      <section>
        <h2>hover</h2>
        <MediaBetweenText
          firstText="the "
          secondText=" lake"
          mediaUrl="https://picsum.photos/seed/lake/480/280"
          mediaType="image"
          alt="A lake"
          className="mbt-demo__line"
          mediaContainerClassName="mbt-demo__media"
        />
      </section>

      {/* inView: opens once on scroll, and stays open. */}
      <section>
        <h2>inView</h2>
        <MediaBetweenText
          firstText="a "
          secondText=" morning"
          mediaUrl="https://picsum.photos/seed/morning/480/280"
          mediaType="image"
          alt="A morning"
          triggerType="inView"
          useInViewOptionsProp={{ once: true, amount: 0.8 }}
          className="mbt-demo__line"
          mediaContainerClassName="mbt-demo__media"
        />
      </section>

      {/* Ref: you decide when. */}
      <section>
        <h2>ref</h2>
        <MediaBetweenText
          ref={manual}
          firstText="press "
          secondText=" to open"
          mediaUrl="https://picsum.photos/seed/open/480/280"
          mediaType="image"
          alt="Revealed on demand"
          triggerType="ref"
          className="mbt-demo__line"
          mediaContainerClassName="mbt-demo__media"
        />
        <div className="mbt-demo__controls">
          <button onClick={() => manual.current?.animate()}>animate</button>
          <button onClick={() => manual.current?.reset()}>reset</button>
        </div>
      </section>

      {/*
        Video works the same way. `fallbackUrl` is the poster, so the block
        still reads as intended before the file loads — or if you haven't
        dropped one at `public/video.mp4` yet.
      */}
      <section>
        <h2>video</h2>
        <MediaBetweenText
          firstText="in "
          secondText=" motion"
          mediaUrl="/video.mp4"
          mediaType="video"
          fallbackUrl="https://picsum.photos/seed/motion/480/280"
          className="mbt-demo__line"
          mediaContainerClassName="mbt-demo__media"
        />
      </section>

      {/* The reveal is just a variant — swap it for any Motion animation. */}
      <section>
        <h2>custom variants</h2>
        <MediaBetweenText
          firstText="fade "
          secondText=" in"
          mediaUrl="https://picsum.photos/seed/fade/480/280"
          mediaType="image"
          alt="Fading in"
          animationVariants={{
            initial: { width: 0, opacity: 0 },
            animate: {
              width: "auto",
              opacity: 1,
              transition: { duration: 0.8, type: "spring", bounce: 0.3 },
            },
          }}
          className="mbt-demo__line"
          mediaContainerClassName="mbt-demo__media mbt-demo__media--round"
        />
      </section>
    </div>
  );
}
