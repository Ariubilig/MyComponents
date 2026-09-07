import { useState, useEffect, useRef } from "react";

const EASE = "cubic-bezier(0.075, 0.82, 0.165, 1)";

/* Static style objects, hoisted out of render. Nothing here depends on props
 * or state, and hovering re-renders all twenty items — so rebuilding these
 * every time was roughly sixty throwaway objects per pointer move. */
const STAGE = {
  position: "relative",
  width: "100%",
  height: "100vh",
  backgroundColor: "#000000",
  overflow: "hidden",
};

const CONTAINER = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "90vw",
  maxWidth: "1400px",
  display: "flex",
  justifyContent: "center",
  padding: 0,
  transform: "translate(-50%, -50%)",
  transformOrigin: "center",
};

const GALLERY = {
  position: "relative",
  width: "100%",
  height: "400px",
  margin: "0 auto",
};

const GALLERY_ITEM = {
  position: "absolute",
  top: 0,
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#000",
  transition: `all 1s ${EASE}`,
  overflow: "hidden",
  willChange: "left, width",
};

/* The image style only ever takes two shapes, so they are constants rather
 * than a factory invoked once per item per render. */
const IMAGE_BASE = {
  width: "400px",
  height: "100%",
  objectFit: "contain",
  transition: `transform 0.6s ${EASE}`,
};
const IMAGE_EXPANDED = { ...IMAGE_BASE, transform: "scale(1)" };
const IMAGE_COLLAPSED = { ...IMAGE_BASE, transform: "scale(1.5)" };

const SpotlightGallery = () => {
  const [currentExpandedIndex, setCurrentExpandedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [clickedItems, setClickedItems] = useState(new Set());
  const [itemCount, setItemCount] = useState(20);
  const containerRef = useRef(null);

  const collapsedWidth = 20;
  const expandedWidth = 400;
  const mobileExpandedWidth = 100;
  const gap = 5;

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth < 1000;
      setIsMobile(newIsMobile);
      setItemCount(newIsMobile ? 10 : 20);
      setClickedItems(new Set());
      setCurrentExpandedIndex(0);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Calculate positions for each item
  const calculatePositions = (expandedIndex) => {
    const positions = [];
    const totalItems = itemCount;
    const currentExpandedWidth = isMobile ? mobileExpandedWidth : expandedWidth;

    // Calculate total width needed
    let totalWidth = 0;
    for (let i = 0; i < totalItems; i++) {
      if (i === expandedIndex) {
        totalWidth += currentExpandedWidth + gap;
      } else {
        totalWidth += collapsedWidth + gap;
      }
    }
    totalWidth -= gap;

    // Calculate starting position to center the gallery
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const startLeft = (containerWidth - totalWidth) / 2;

    let currentLeft = startLeft;

    for (let i = 0; i < totalItems; i++) {
      if (i === expandedIndex) {
        positions.push({
          left: currentLeft,
          width: currentExpandedWidth,
        });
        currentLeft += currentExpandedWidth + gap;
      } else {
        positions.push({
          left: currentLeft,
          width: collapsedWidth,
        });
        currentLeft += collapsedWidth + gap;
      }
    }

    return positions;
  };

  const positions = calculatePositions(currentExpandedIndex);

  // Handle desktop mouse enter
  const handleMouseEnter = (index) => {
    if (!isMobile) {
      setCurrentExpandedIndex(index);
    }
  };

  // Handle mobile click
  const handleClick = (index) => {
    if (isMobile) {
      const newClickedItems = new Set(clickedItems);

      if (newClickedItems.has(index) && currentExpandedIndex === index) {
        newClickedItems.delete(index);
        const nextIndex =
          newClickedItems.size > 0 ? Math.min(...newClickedItems) : 0;
        setCurrentExpandedIndex(nextIndex);
      } else {
        newClickedItems.add(index);
        setCurrentExpandedIndex(index);
      }

      setClickedItems(newClickedItems);
    }
  };

  /* The only three values that genuinely vary per item. */
  const galleryItemStyle = (index) => ({
    ...GALLERY_ITEM,
    left: `${positions[index]?.left || 0}px`,
    width: `${positions[index]?.width || collapsedWidth}px`,
    cursor: isMobile ? "pointer" : "default",
  });

  return (
    <div style={STAGE}>
      <div style={CONTAINER}>
        <div style={GALLERY} ref={containerRef}>
          {Array.from({ length: itemCount }, (_, i) => i + 1).map(
            (num, index) => (
              <div
                key={index}
                style={galleryItemStyle(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleClick(index)}
              >
                <img
                  src={`spotlight/spotlight-${num}.jpg`}
                  alt={`Spotlight ${num}`}
                  style={
                    index === currentExpandedIndex
                      ? IMAGE_EXPANDED
                      : IMAGE_COLLAPSED
                  }
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotlightGallery;
