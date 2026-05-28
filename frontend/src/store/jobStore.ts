import { create } from 'zustand';
import type { Job } from '../lib/mockData';
import { api } from '../lib/api';

interface JobFilters {
  keyword: string;
  location: string;
  jobType: string;
  category: string;
  isRemote: boolean | null;
  salaryMin: number;
  salaryMax: number;
  sortBy: string;
}

interface JobStore {
  jobs: Job[];
  savedJobIds: string[];
  filters: JobFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalJobs: number;
  loadJobs?: (opts?: { append?: boolean; limit?: number; offset?: number }) => Promise<void>;
  loadMore?: () => Promise<void>;
  refreshJobs?: () => Promise<void>;
  setFilter: (key: keyof JobFilters, value: any) => void;
  resetFilters: () => void;
  toggleSaveJob: (jobId: string) => void;
  getFilteredJobs: () => Job[];
  getJobById: (id: string) => Job | undefined;
}

const defaultFilters: JobFilters = {
  keyword: '',
  location: '',
  jobType: '',
  category: '',
  isRemote: null,
  salaryMin: 0,
  salaryMax: 500000,
  sortBy: 'relevance',
};

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  savedJobIds: [],
  filters: { ...defaultFilters },
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  hasMore: true,
  totalJobs: 0,
  // load jobs from backend
  // call once on app start: useJobStore.getState().loadJobs()
  loadJobs: async (opts = {}) => {
    const { append = false, limit = 20, offset = 0 } = opts;
    set({ isLoading: !append, isLoadingMore: append });
    try {
      const data = await api.get(`/jobs?limit=${limit}&offset=${offset}`);
      const items = Array.isArray(data) ? data : (data?.items || []);
      const normalized = (items || []).map((j: any) => ({
        ...j,
        tags: Array.isArray(j.tags)
          ? j.tags
          : typeof j.tags === 'string'
          ? j.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [],
      }));
      const totalJobs = typeof data?.total === 'number' ? data.total : normalized.length;
      const hasMore = typeof data?.hasMore === 'boolean' ? data.hasMore : false;
      set((state) => ({
        jobs: append ? [...state.jobs, ...normalized] : normalized,
        isLoading: false,
        isLoadingMore: false,
        totalJobs,
        hasMore,
      }));
      // if user logged in, also fetch saved ids
      try {
        const saved = await api.get('/saved');
        if (Array.isArray(saved)) set({ savedJobIds: saved });
      } catch (e) {
        // ignore if not authenticated
      }
    } catch (e) {
      console.error('Failed to load jobs', e);
      set({ isLoading: false, isLoadingMore: false, isRefreshing: false });
    }
  },

  loadMore: async () => {
    const { jobs, hasMore, isLoadingMore, loadJobs } = get();
    if (!hasMore || isLoadingMore || !loadJobs) return;
    await loadJobs({ append: true, limit: 20, offset: jobs.length });
  },

  refreshJobs: async () => {
    const { loadJobs } = get();
    if (!loadJobs) return;
    set({ isRefreshing: true });
    try {
      await api.post('/jobs/refresh');
      await loadJobs({ append: false, limit: 20, offset: 0 });
    } finally {
      set({ isRefreshing: false });
    }
  },

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  toggleSaveJob: async (jobId: string) => {
    const { savedJobIds } = get();
    const isSaved = savedJobIds.includes(jobId);
    try {
      if (!isSaved) {
        await api.post('/saved', { job_id: jobId });
        set((state) => ({ savedJobIds: [...state.savedJobIds, jobId] }));
      } else {
        await api.del(`/saved/${jobId}`);
        set((state) => ({ savedJobIds: state.savedJobIds.filter((id) => id !== jobId) }));
      }
    } catch (e) {
      console.error('Failed to toggle save', e);
    }
  },

  getFilteredJobs: () => {
    const { jobs, filters } = get();
    let filtered = [...jobs];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw) ||
          j.tags.some((t) => t.toLowerCase().includes(kw))
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(loc)
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter((j) => j.jobType === filters.jobType);
    }

    if (filters.category) {
      filtered = filtered.filter((j) => j.category === filters.category);
    }

    if (filters.isRemote !== null) {
      filtered = filtered.filter((j) => j.isRemote === filters.isRemote);
    }

    if (filters.salaryMin > 0) {
      filtered = filtered.filter(
        (j) => j.salaryMin !== null && j.salaryMin >= filters.salaryMin
      );
    }

    if (filters.salaryMax < 500000) {
      filtered = filtered.filter(
        (j) => j.salaryMax !== null && j.salaryMax <= filters.salaryMax
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
        break;
      case 'salary-desc':
        filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        break;
      case 'salary-asc':
        filtered.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        break;
    }

    return filtered;
  },

  getJobById: (id: string) => get().jobs.find((j) => j.id === id),
}));
