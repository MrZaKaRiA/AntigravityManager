import { app } from '@/modules/app-shell/ipc/app';
import { theme } from '@/modules/app-shell/ipc/theme';
import { window } from '@/modules/app-shell/ipc/window';
import { databaseRouter } from '@/shared/persistence/database/router';
import { accountRouter } from '@/modules/account/ipc/router';
import { cloudRouter } from '@/modules/cloud-account/ipc/router';
import { configRouter } from '@/modules/config/ipc/router';
import { gatewayRouter } from '@/modules/proxy-gateway/ipc/router';

import { os } from '@orpc/server';
import { z } from 'zod';
import {
  isProcessRunning,
  closeAntigravity,
  startAntigravity,
} from '@/modules/antigravity-runtime/ipc/handler';
import { AntigravityAppTargetSchema } from '@/modules/account/types';
import { systemHandler } from '@/modules/app-shell/ipc/system/handler';
import { logger } from '../shared/logging/logger';

const ProcessTargetInputSchema = z
  .object({ target: AntigravityAppTargetSchema.optional() })
  .optional();

// Log middleware setup
const logMiddleware = os.middleware(async (opts: any) => {
  const { next, path, meta } = opts;
  const requestPath = path || meta?.path || 'unknown';

  try {
    const result = await next({});
    return result;
  } catch (err) {
    logger.error(`[ORPC] Error in handler for ${JSON.stringify(requestPath)}:`, err);
    throw err;
  }
});

// Explicit Router Definition
export const router = os.use(logMiddleware).router({
  ping: os.output(z.string()).handler(async () => 'pong'),

  theme,
  window,
  app,
  database: databaseRouter,

  // Inline process router to ensure structure
  proc: os.router({
    isProcessRunning: os
      .input(ProcessTargetInputSchema)
      .output(z.boolean())
      .handler(async ({ input }) => {
        return await isProcessRunning(input?.target);
      }),
    closeAntigravity: os
      .input(ProcessTargetInputSchema)
      .output(z.void())
      .handler(async ({ input }) => {
        await closeAntigravity(input?.target);
      }),
    startAntigravity: os
      .input(ProcessTargetInputSchema)
      .output(z.void())
      .handler(async ({ input }) => {
        await startAntigravity(input?.target);
      }),
  }),

  account: accountRouter,
  cloud: cloudRouter,
  config: configRouter,
  gateway: gatewayRouter,
  system: systemHandler,
});
