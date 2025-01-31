import { fetchNFTBrandMetrics } from '../api/nftBrandMetrics';
import { fetchNFTBrandProfiles } from '../api/nftBrandProfile';
import { fetchNFTBrandContractProfile } from '../api/nftBrandContractProfile';
import { fetchNFTContractMetrics } from '../api/nftContractMetrics';
import { fetchNFTBrandMetadata } from '../api/nftMetadata';
import { fetchNFTBrandCategories } from '../api/nftBrandCategory';

class Store {
  constructor() {
    this.state = {
      brandMetrics: null,
      brandProfile: null,
      brandContractProfile: null,
      contractMetrics: null,
      brandMetadata: null,
      brandCategory: null,
      isLoading: false,
      error: null
    };
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.state);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Brand Metrics
  async fetchBrandMetrics() {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetchNFTBrandMetrics();
      const formattedData = response.data.map(item => ({
        name: item.brand_name || item.name || 'Unknown Brand',
        market_cap: parseFloat(item.market_cap) || 0,
        volume_24h: parseFloat(item.volume_24h) || 0,
        total_volume: parseFloat(item.total_volume) || 0,
        growth_rate: parseFloat(item.growth_rate) || 0,
        traders: parseInt(item.traders) || 0,
        holders: parseInt(item.holders) || 0,
        mint_tokens: parseInt(item.mint_tokens) || 0,
        total_revenue: parseFloat(item.total_revenue) || 0,
        marketplace_volume: item.marketplace_volume || {}
      }));

      this.setState({
        brandMetrics: formattedData,
        error: null
      });
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error fetching brand metrics:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Brand Profile
  async fetchBrandProfile() {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetchNFTBrandProfiles();
      this.setState({
        brandProfile: response.data,
        error: null
      });
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error fetching brand profile:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Brand Contract Profile
  async fetchBrandContractProfile() {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetchNFTBrandContractProfile();
      this.setState({
        brandContractProfile: response.data,
        error: null
      });
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error fetching brand contract profile:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Contract Metrics
  async fetchContractMetrics() {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetchNFTContractMetrics();
      this.setState({
        contractMetrics: response.data,
        error: null
      });
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error fetching contract metrics:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Brand Metadata
  async fetchBrandMetadata() {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetchNFTBrandMetadata();
      this.setState({
        brandMetadata: response.data,
        error: null
      });
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error fetching brand metadata:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Brand Category
  async fetchBrandCategory() {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetchNFTBrandCategories();
      this.setState({
        brandCategory: response.data,
        error: null
      });
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error fetching brand category:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Refresh all data
  async refreshData() {
    try {
      this.setState({ isLoading: true, error: null });
      await Promise.all([
        this.fetchBrandMetrics(),
        this.fetchBrandProfile(),
        this.fetchBrandContractProfile(),
        this.fetchContractMetrics(),
        this.fetchBrandMetadata(),
        this.fetchBrandCategory()
      ]);
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Error refreshing data:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Getters
  getState() {
    return this.state;
  }

  getBrandMetrics() {
    return {
      data: this.state.brandMetrics,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }

  getBrandProfile() {
    return {
      data: this.state.brandProfile,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }

  getBrandContractProfile() {
    return {
      data: this.state.brandContractProfile,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }

  getContractMetrics() {
    return {
      data: this.state.contractMetrics,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }

  getBrandMetadata() {
    return {
      data: this.state.brandMetadata,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }

  getBrandCategory() {
    return {
      data: this.state.brandCategory,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }
}

const store = new Store();
export default store;
