import { useState, useEffect, useRef } from 'react';


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
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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
        const nextIndex = newClickedItems.size > 0 ? Math.min(...newClickedItems) : 0;
        setCurrentExpandedIndex(nextIndex);
      } else {
        newClickedItems.add(index);
        setCurrentExpandedIndex(index);
      }
      
      setClickedItems(newClickedItems);
    }
  };

  const styles = {
    spotlight: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#000000',
      overflow: 'hidden',
    },
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '90vw',
      maxWidth: '1400px',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
      transform: 'translate(-50%, -50%)',
      transformOrigin: 'center',
    },
    gallery: {
      position: 'relative',
      width: '100%',
      height: '400px',
      margin: '0 auto',
    },
    galleryItem: (index) => ({
      position: 'absolute',
      top: 0,
      left: `${positions[index]?.left || 0}px`,
      width: `${positions[index]?.width || collapsedWidth}px`,
      height: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000',
      transition: 'all 1s cubic-bezier(0.075, 0.82, 0.165, 1)',
      overflow: 'hidden',
      willChange: 'left, width',
      cursor: isMobile ? 'pointer' : 'default',
    }),
    image: (isExpanded) => ({
      width: '400px',
      height: '100%',
      objectFit: 'contain',
      transform: isExpanded ? 'scale(1)' : 'scale(1.5)',
      transition: 'transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1)',
    }),
    nav: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 10,
      color: '#fff',
      fontSize: '16px',
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      margin: '0 10px',
    },
  };

  return (
    <div style={styles.spotlight}>

      <div style={styles.container}>
        <div style={styles.gallery} ref={containerRef}>
          {Array.from({ length: itemCount }, (_, i) => i + 1).map((num, index) => (
            <div
              key={index}
              style={styles.galleryItem(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
            >
              <img
                src={`spotlight/spotlight-${num}.jpg`}
                alt={`Spotlight ${num}`}
                style={styles.image(index === currentExpandedIndex)}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SpotlightGallery;