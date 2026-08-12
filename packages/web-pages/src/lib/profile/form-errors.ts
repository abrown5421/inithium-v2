import type { z } from 'zod';

export const buildFieldErrorMap = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce<Record<string, string>>((acc, issue) => {
    if (issue.path.length === 0) return acc;
    const key = issue.path.join('.');
    return key in acc ? acc : { ...acc, [key]: issue.message };
  }, {});
