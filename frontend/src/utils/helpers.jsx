// Function to get poster URL
export const getPosterUrl = (path, size = 'w500') => {
    if (!path) return '/images/no-poster.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };
  
  // Function to get backdrop URL
  export const getBackdropUrl = (path, size = 'original') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };
  
  // Function to format runtime/duration
  export const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Function to format release date
  export const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to format release year for cards
  export const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };
  
  // Function to format rating for display
  export const formatRating = (rating) => {
    // Handle empty string case
    if (rating === '') {
      return 'N/A';
    }
    
    // Return 'N/A' if rating is undefined, null, or not a number
    if (rating === undefined || rating === null || isNaN(rating)) {
      return 'N/A';
    }
    
    // Convert to number if it's a string
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    
    // Format to one decimal place
    return numRating.toFixed(1);
  };
  
  // Function to get country name from country code
  export const getCountryName = (countryCode) => {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    try {
      return regionNames.of(countryCode);
    } catch (e) {
      return countryCode; // Fallback to code if name cant be resolved
    }
  };
  
  // Function to truncate text with ellipsis
  export const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };