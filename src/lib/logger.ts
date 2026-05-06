/**
 * Purpose: Structured logger for ECOM-AI — replaces all console.* calls.
 *          Supports typed levels (Info, Warn, Error, Debug) with context.
 *          Debug logs are stripped in production builds.
 * Dependencies: None (zero-dep)
 * Related: CLAUDE.md (Surgical Logging Protocol), Architecture Finale.md §52
 *
 * WHY: Zero console.* in production. Every log has context (who, what, where).
 *      Debug logs vanish in production — no performance cost.
 *      Future: plug into any transport (file, Loki, Datadog) by replacing transport().
 *
 * USAGE:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Page generated', { pageType: 'upsell', duration: 1200 });
 *   logger.error('LLM call failed', { model: 'gpt-4o', status: 429 });
 *   logger.debug('Block tree parsed', { blocks: 12 });  // stripped in prod
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  context?: Record<string, unknown>;
  source?: string;
}

// ─── Configuration ────────────────────────────────────────────────────────────

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MIN_LEVEL: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** Current minimum log level — debug stripped in production */
const currentMinLevel: LogLevel = IS_PRODUCTION ? 'info' : 'debug';

// ─── Transport ────────────────────────────────────────────────────────────────

/**
 * Default transport — writes to stdout/stderr.
 * Replace this function to plug into Loki, Datadog, etc.
 */
function transport(entry: LogEntry): void {
  const { level, timestamp, message, context, source } = entry;
  const prefix = source ? `[${source}]` : '';
  const ctx = context ? ` ${JSON.stringify(context)}` : '';

  const output = `${timestamp} ${level.toUpperCase().padEnd(5)} ${prefix} ${message}${ctx}`;

  if (level === 'error') {
    process.stderr.write(output + '\n');
  } else {
    process.stdout.write(output + '\n');
  }
}

// ─── Logger Class ─────────────────────────────────────────────────────────────

class Logger {
  private source?: string;

  constructor(source?: string) {
    this.source = source;
  }

  /** Create a child logger with a fixed source tag */
  withSource(source: string): Logger {
    return new Logger(source);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (MIN_LEVEL[level] < MIN_LEVEL[currentMinLevel]) return;

    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      ...(context ? { context } : {}),
      ...(this.source ? { source: this.source } : {}),
    };

    transport(entry);
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const logger = new Logger();

/**
 * Create a scoped logger for a specific module.
 * USAGE: const log = createLogger('page-generator');
 *        log.info('Generation started', { pageType: 'upsell' });
 */
export function createLogger(source: string): Logger {
  return new Logger(source);
}

export type { Logger, LogLevel, LogEntry };
