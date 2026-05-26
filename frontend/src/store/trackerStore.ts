import { create } from 'zustand';
import { mockApplications, mockJobs } from '../lib/mockData';
import type { Application } from '../lib/mockData';

export type TrackerStatus = 'saved' | 'applied' | 'interview' | 'rejected' | 'offer';

interface TrackerStore {
  applications: Application[];
  addApplication: (jobId: string, status?: TrackerStatus) => void;
  moveApplication: (applicationId: string, newStatus: TrackerStatus) => void;
  removeApplication: (applicationId: string) => void;
  updateNotes: (applicationId: string, notes: string) => void;
  getApplicationsByStatus: (status: TrackerStatus) => Application[];
  getApplicationByJobId: (jobId: string) => Application | undefined;
  isJobTracked: (jobId: string) => boolean;
}

export const useTrackerStore = create<TrackerStore>((set, get) => ({
  applications: mockApplications,

  addApplication: (jobId: string, status: TrackerStatus = 'saved') => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (!job || get().isJobTracked(jobId)) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      status,
      notes: '',
      appliedAt: status === 'saved' ? '' : new Date().toISOString(),
      statusChangedAt: new Date().toISOString(),
    };
    set((state) => ({ applications: [...state.applications, newApp] }));
  },

  moveApplication: (applicationId: string, newStatus: TrackerStatus) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: newStatus,
              statusChangedAt: new Date().toISOString(),
              appliedAt:
                newStatus !== 'saved' && !app.appliedAt
                  ? new Date().toISOString()
                  : app.appliedAt,
            }
          : app
      ),
    })),

  removeApplication: (applicationId: string) =>
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== applicationId),
    })),

  updateNotes: (applicationId: string, notes: string) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId ? { ...app, notes } : app
      ),
    })),

  getApplicationsByStatus: (status: TrackerStatus) =>
    get().applications.filter((a) => a.status === status),

  getApplicationByJobId: (jobId: string) =>
    get().applications.find((a) => a.jobId === jobId),

  isJobTracked: (jobId: string) =>
    get().applications.some((a) => a.jobId === jobId),
}));
