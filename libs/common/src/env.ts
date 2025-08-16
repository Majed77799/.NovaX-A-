export type EnvSpec = Record<string, { required?: boolean; default?: string }>; 

export function loadEnv<T extends Record<string, string>>(spec: EnvSpec): T {
  const result: Record<string, string> = {};
  for (const [key, rules] of Object.entries(spec)) {
    const value = process.env[key] ?? rules.default;
    if ((rules.required ?? false) && (value === undefined || value === "")) {
      throw new Error(`Missing required env var: ${key}`);
    }
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}