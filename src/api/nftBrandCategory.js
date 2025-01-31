import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY 

export const fetchNFTBrandCategories = async () => {
  const options = {
    method: 'GET',
    url: 'https://api.unleashnfts.com/api/v2/nft/brand/category',
    params: {
      blockchain: 'ethereum',
      offset: '0',
      limit: '100'
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
    console.error('Error fetching NFT brand categories:', error);
    throw error;
  }
};
