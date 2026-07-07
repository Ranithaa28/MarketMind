"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import { createApiClient } from "@/lib/api";

/**
 * Returns a function that resolves a fresh, authenticated axios client.
 * Clerk session tokens are short-lived, so we fetch a new one per call
 * rather than caching it.
 */
export function useApiClient() {
  const { getToken } = useAuth();

  return useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);
}
