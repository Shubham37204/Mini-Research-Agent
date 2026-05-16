import { apiClient } from './api-client';
import { FindingSchema, ReviewSessionSchema, type Finding, type ReviewSession } from '@/schemas/domain';
import { z } from 'zod';

export const SessionSummarySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  model: z.string(),
  findings: z.number(),
  severity: z.string(),
});

export type SessionSummary = z.infer<typeof SessionSummarySchema>;

export const reviewService = {
  async getSessions(): Promise<SessionSummary[]> {
    return apiClient.get('/reviews/sessions', {
      schema: z.array(SessionSummarySchema),
    });
  },

  async getSession(id: string): Promise<ReviewSession> {
    return apiClient.get(`/reviews/sessions/${id}`, {
      schema: ReviewSessionSchema,
    });
  },

  async getFindings(sessionId: string): Promise<Finding[]> {
    return apiClient.get(`/reviews/sessions/${sessionId}/findings`, {
      schema: z.array(FindingSchema),
    });
  },
};
