import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/RecommendationsPage.css';

interface Destination {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: { text: string; type: string }[];
  rating: number;
  duration: string;
}

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [destinations] = useState<Destination[]>([
    {
      id: '1',
      title: 'Romantic Paris Getaway',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=3273&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Explore the romance and art of Paris, from the Eiffel Tower to the Louvre, experiencing the elegance and sophistication of French life.',
      tags: [
        { text: 'Romantic', type: 'romantic' },
        { text: 'Art', type: 'art' },
        { text: 'Cuisine', type: 'cuisine' }
      ],
      rating: 4.8,
      duration: '5 Days 4 Nights'
    },
    {
      id: '2',
      title: 'Tokyo Urban Exploration',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Experience the blend of modern and traditional in Tokyo, from the bustling Shibuya to the serene Sensoji Temple, discovering the unique charm of Japanese culture.',
      tags: [
        { text: 'Urban', type: 'urban' },
        { text: 'Culture', type: 'culture' },
        { text: 'Shopping', type: 'shopping' }
      ],
      rating: 4.7,
      duration: '6 Days 5 Nights'
    },
    {
      id: '3',
      title: 'Maldives Island Retreat',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=3280&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Relax in the crystal-clear waters of the Maldives, enjoying luxurious overwater villas and abundant marine activities.',
      tags: [
        { text: 'Island', type: 'island' },
        { text: 'Resort', type: 'resort' },
        { text: 'Diving', type: 'diving' }
      ],
      rating: 4.9,
      duration: '7 Days 6 Nights'
    }
  ]);

  useEffect(() => {
    // Scroll to show the create plan card partially on load
    if (gridRef.current) {
      const scrollWidth = gridRef.current.scrollWidth;
      const clientWidth = gridRef.current.clientWidth;
      const createCardWidth = 350; // Width of the create plan card
      const scrollPosition = scrollWidth - clientWidth - createCardWidth + 100; // Show 100px of the card
      
      gridRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleDestinationClick = (id: string) => {
    navigate(`/recommendations/${id}`);
  };

  const handleCreatePlanClick = () => {
    navigate('/form');
  };

  const handleScroll = () => {
    if (gridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (gridRef.current) {
      const scrollAmount = 400; // Adjust this value to control scroll distance
      const currentScroll = gridRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      gridRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="recommendations-page">
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h1>Featured Destinations</h1>
          <p>Explore amazing destinations around the world and find your perfect trip</p>
        </div>
        
        <div className="recommendations-grid" ref={gridRef} onScroll={handleScroll}>
          {destinations.map((destination) => (
            <article
              key={destination.id}
              className="destination-card"
              onClick={() => handleDestinationClick(destination.id)}
            >
              <img
                src={destination.image}
                alt={destination.title}
                className="destination-image"
              />
              <section className="destination-content">
                <h2 className="destination-title">{destination.title}</h2>
                <p className="destination-description">{destination.description}</p>
                
                <nav className="destination-tags">
                  {destination.tags.map((tag, index) => (
                    <span key={index} className="tag" data-type={tag.type}>
                      {tag.text}
                    </span>
                  ))}
                </nav>
                
                <footer className="destination-meta">
                  <section className="destination-rating">
                    <i className="fas fa-star"></i>
                    <span>{destination.rating}</span>
                  </section>
                  <section className="destination-duration">
                    {destination.duration}
                  </section>
                </footer>
              </section>
            </article>
          ))}
          
          <article
            className="destination-card create-plan-card"
            onClick={handleCreatePlanClick}
          >
            <section className="create-plan-content">
              <figure className="create-plan-icon">
                <i className="fas fa-plus"></i>
              </figure>
              <h2 className="destination-title">Create Your Own Plan</h2>
              <p className="destination-description">
                Design a personalized travel itinerary tailored to your preferences and interests.
              </p>
              <nav className="destination-tags">
                <span className="tag" data-type="custom">
                  Custom
                </span>
                <span className="tag" data-type="personalized">
                  Personalized
                </span>
              </nav>
            </section>
          </article>
        </div>

        <button 
          className="navigation-button prev"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <i className="fas fa-chevron-circle-left"></i>
        </button>

        <button 
          className="navigation-button next"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <i className="fas fa-chevron-circle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default RecommendationsPage; 