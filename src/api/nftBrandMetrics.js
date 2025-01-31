import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY 
export const fetchNFTBrandMetrics = async () => {
  const options = {
    method: 'GET',
    url: 'https://api.unleashnfts.com/api/v2/nft/brand/metrics',
    params: { sort_by: 'mint_tokens' },
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching NFT brand metrics:', error);
    throw error;
  }
};
