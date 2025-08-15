export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(target: T, source: U): T & U {
  const output: Record<string, unknown> = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const targetValue = (target as Record<string, unknown>)[key];
    const sourceValue = (source as Record<string, unknown>)[key];
    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      output[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      output[key] = sourceValue;
    }
  }
  return output as T & U;
}

export function generateId(prefix = 'id'): string {
  const random = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${random}`;
}