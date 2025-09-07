export default function AppWithDynamicImages() {
  const location = useLocation();
  
  const getTransitionImage = (pathname) => {
    switch (pathname) {
      case '/':
        return '/assets/home-transition.jpg';
      case '/about':
        return '/assets/about-transition.jpg';
      case '/services':
        return '/assets/services-transition.jpg';
      default:
        return '/assets/default-transition.jpg';
    }
  };

  return (
    <Router>
      <FadeDownUp 
        transitionImage={getTransitionImage(location.pathname)}
        routeNames={['Home', 'About', 'Services', 'Contact']}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </FadeDownUp>
    </Router>
  );
}