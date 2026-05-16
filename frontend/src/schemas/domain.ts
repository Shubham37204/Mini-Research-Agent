import { z } from 'zod';

export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);
export type Severity = z.infer<typeof SeveritySchema>;

export const FindingCategorySchema = z.enum(['security', 'bug', 'performance', 'maintainability', 'style']);
export type FindingCategory = z.infer<typeof FindingCategorySchema>;

export const FindingSchema = z.object({
  id: z.string().uuid(),
  file_path: z.string(),
  line_start: z.number(),
  line_end: z.number(),
  category: FindingCategorySchema,
  severity: SeveritySchema,
  confidence: z.number().min(0).max(1),
  title: z.string(),
  description: z.string(),
  suggestion: z.string().optional(),
  engine_id: z.string(),
  cwe: z.string().optional(),
  owasp: z.string().optional(),
  metadata: z.record(z.any()),
});

export type Finding = z.infer<typeof FindingSchema>;

export const ReviewSessionSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  target: z.object({
    repo_path: z.string(),
    base_ref: z.string(),
    head_ref: z.string(),
    diff_content: z.string(),
  }),
  provider: z.object({
    provider_name: z.string(),
    model_id: z.string(),
  }),
  analysis: z.object({
    findings: z.array(FindingSchema),
  }),
});

export type ReviewSession = z.infer<typeof ReviewSessionSchema>;
