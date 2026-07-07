import axios from "axios";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Client-side API instance. Pass the Clerk session token in from a
 * component via `useAuth().getToken()` and attach it per-request, e.g.:
 *
 *   const { getToken } = useAuth();
 *   const token = await getToken();
 *   const api = createApiClient(token);
 *   await api.get("/api/ideas");
 */
export function createApiClient(token: string | null) {
  const instance = axios.create({ baseURL: apiBaseUrl });
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
}

export interface SuccessScore {
  overall_score: number;
  strength_meter: number;
  risk_meter: number;
  opportunity_meter: number;
  breakdown: Array<{
    factor: string;
    raw_score: number;
    weight: number;
    inverted: boolean;
    contribution: number;
    reason: string;
  }>;
  methodology: string;
  disclaimer: string;
}

export interface IdeaDetail {
  id: string;
  title: string;
  raw_description: string;
  status: "pending" | "running" | "complete" | "failed" | "archived";
  analysis?: Record<string, any>;
  competitors?: { competitors: Array<Record<string, any>> };
  market_research?: Record<string, any>;
  investment?: Record<string, any>;
  locations?: { recommendations: Array<Record<string, any>> };
  swot?: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  lean_canvas?: Record<string, any>;
  business_model_canvas?: Record<string, any>;
  strategy?: Record<string, any>;
  success_score?: SuccessScore;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface IdeaSummary {
  id: string;
  title: string;
  status: string;
  created_at: string;
  success_score?: SuccessScore;
}
