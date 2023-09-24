export function formatString(val: string, params?: Record<string, string>) {
  let formatted = val;

  for (const param in params) {
    formatted = formatted.replace(`[${param}]`, params[param]);
  }

  return formatted;
}
