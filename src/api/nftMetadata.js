import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY 
const BASE_URL = 'https://api.unleashnfts.com/api/v2/nft';

const nftApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'accept': 'application/json',
    'x-api-key': API_KEY
  }
});

export const fetchNFTBrandMetadata = async (params = {}) => {
  const defaultParams = {
    blockchain: 'ethereum',
    offset: '0',
    limit: '100'
  };

  try {
    const response = await nftApi.get('/brand/metadata', {
      params: { ...defaultParams, ...params }
    });

    if (!response.data) {
      throw new Error('No data received from metadata API');
    }

    // Handle both response formats
    const responseData = response.data.data || response.data;
    return {
      data: Array.isArray(responseData) ? responseData : [responseData],
      pagination: response.data.pagination || {
        has_next: false,
        limit: 100,
        offset: 0,
        total_items: responseData ? 1 : 0
      }
    };
  } catch (error) {
    console.error('Error fetching NFT brand metadata:', error);
    throw error;
  }
};
