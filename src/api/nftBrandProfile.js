import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY  
export const fetchNFTBrandProfiles = async () => {
  const options = {
    method: 'GET',
    url: 'https://api.unleashnfts.com/api/v2/nft/brand/profile',
    params: {
      blockchain: 'ethereum',
      time_range: '24h',
      offset: '0',
      limit: '100',
      sort_by: 'diamond_hands',
      sort_order: 'desc'
    },
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching NFT brand profiles:', error);
    throw error;
  }
};
