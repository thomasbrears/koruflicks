import React, { useEffect, useState } from "react";
import { getPopularMoviesAndShows } from "../utils/api";
import PopularSection from '../components/PopularSection';
import HeroSlider from "../components/HeroSlider";
import SearchBar from "../components/SearchBar";
import CategoriesSection from "../components/CategoriesSection";
import SupportSection from "../components/SupportSection";

const HomePage = () => {
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data for the hero slider when component mounts
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const mixedItems = await getPopularMoviesAndShows();
        setHeroItems(mixedItems);
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-black">
      
      {/* Hero Slider Section */}
      <HeroSlider 
        items={heroItems} 
        pageType="home"
        loading={loading}
      />

      {/* Search Bar */}
      <SearchBar />
      

      {/* Popular Section */}
      <PopularSection />

      
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 pt-8 pb-16 bg-black">
        {/* Catregory Section */}
        <CategoriesSection/>
      
        {/* Support section */}
        <SupportSection />
      </div>
    </div>
  );
};

export default HomePage;