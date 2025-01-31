import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY 

export const fetchNFTBrandContractProfile = async () => {
  const options = {
    method: 'GET',
    url: 'https://api.unleashnfts.com/api/v2/nft/brand/contract_profile',
    params: {
      blockchain: 'ethereum',
      offset: '0',
      limit: '100',
      sort_by: 'diamond_hands'
    },
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY
    }
  };

  try {
    const response = await axios(options);

    if (!response.data) {
      throw new Error('No data received from contract profile API');
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
    console.error('Error fetching NFT brand contract profile:', error);
    throw error;
  }
};
