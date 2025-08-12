export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  url: string;
  filters: {
    tokens: any[];
    freeText?: string;
    queryBody: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSavedSearchRequest {
  name: string;
  description?: string;
  url: string;
  filters: {
    tokens: any[];
    freeText?: string;
    queryBody: any;
  };
}

export interface UpdateSavedSearchRequest {
  name?: string;
  description?: string;
}

class SavedSearchesService {
  private readonly STORAGE_KEY = 'dareg_saved_searches';
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  // Get all saved searches
  async getSavedSearches(): Promise<SavedSearch[]> {
    try {
      // For now, use local storage
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const searches = JSON.parse(stored);
      return searches.map((search: any) => ({
        ...search,
        createdAt: new Date(search.createdAt),
        updatedAt: new Date(search.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting saved searches:', error);
      return [];
    }
  }

  // Get a single saved search by ID
  async getSavedSearch(id: string): Promise<SavedSearch | null> {
    try {
      const searches = await this.getSavedSearches();
      return searches.find(search => search.id === id) || null;
    } catch (error) {
      console.error('Error getting saved search:', error);
      return null;
    }
  }

  // Create a new saved search
  async createSavedSearch(request: CreateSavedSearchRequest): Promise<SavedSearch> {
    try {
      const newSearch: SavedSearch = {
        id: this.generateId(),
        ...request,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const searches = await this.getSavedSearches();
      searches.push(newSearch);
      
      // For now, save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(searches));
      }

      return newSearch;
    } catch (error) {
      console.error('Error creating saved search:', error);
      throw new Error('Failed to create saved search');
    }
  }

  // Update an existing saved search
  async updateSavedSearch(id: string, request: UpdateSavedSearchRequest): Promise<SavedSearch | null> {
    try {
      const searches = await this.getSavedSearches();
      const index = searches.findIndex(search => search.id === id);
      
      if (index === -1) return null;
      
      searches[index] = {
        ...searches[index],
        ...request,
        updatedAt: new Date(),
      };
      
      // For now, save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(searches));
      }

      return searches[index];
    } catch (error) {
      console.error('Error updating saved search:', error);
      throw new Error('Failed to update saved search');
    }
  }

  // Delete a saved search
  async deleteSavedSearch(id: string): Promise<boolean> {
    try {
      const searches = await this.getSavedSearches();
      const filtered = searches.filter(search => search.id !== id);
      
      // For now, save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      }

      return true;
    } catch (error) {
      console.error('Error deleting saved search:', error);
      return false;
    }
  }

  // Check if a search is already saved (by comparing filters)
  async isSearchSaved(filters: { tokens: any[]; freeText?: string; queryBody: any }): Promise<SavedSearch | null> {
    try {
      const searches = await this.getSavedSearches();
      
      return searches.find(search => {
        // Compare tokens
        if (search.filters.tokens.length !== filters.tokens.length) return false;
        
        const tokensMatch = search.filters.tokens.every((token, index) => 
          JSON.stringify(token) === JSON.stringify(filters.tokens[index])
        );
        
        // Compare free text
        const freeTextMatch = search.filters.freeText === filters.freeText;
        
        return tokensMatch && freeTextMatch;
      }) || null;
    } catch (error) {
      console.error('Error checking if search is saved:', error);
      return null;
    }
  }

  // Generate a unique ID
  private generateId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Future: Switch to API endpoint
  private async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.API_BASE_URL) {
      throw new Error('API base URL not configured');
    }

    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Future: API methods (commented out for now)
  /*
  async getSavedSearchesFromAPI(): Promise<SavedSearch[]> {
    return this.apiCall('/saved-searches');
  }

  async createSavedSearchInAPI(request: CreateSavedSearchRequest): Promise<SavedSearch> {
    return this.apiCall('/saved-searches', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateSavedSearchInAPI(id: string, request: UpdateSavedSearchRequest): Promise<SavedSearch> {
    return this.apiCall(`/saved-searches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async deleteSavedSearchFromAPI(id: string): Promise<boolean> {
    return this.apiCall(`/saved-searches/${id}`, {
      method: 'DELETE',
    });
  }
  */
}

// Export a singleton instance
export const savedSearchesService = new SavedSearchesService();
