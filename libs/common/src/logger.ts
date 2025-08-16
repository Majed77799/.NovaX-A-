/* Lightweight logger using console to avoid extra deps. Replace with pino/winston later. */
export class Logger {
  private readonly context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  info(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.log(this.format("INFO", message), meta ?? "");
  }

  warn(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.warn(this.format("WARN", message), meta ?? "");
  }

  error(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.error(this.format("ERROR", message), meta ?? "");
  }

  private format(level: string, message: string): string {
    const ts = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : "";
    return `${ts} ${level} ${ctx} ${message}`.trim();
  }
}