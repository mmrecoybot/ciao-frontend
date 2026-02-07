export function updateSearchParams(searchParams, newParams) {
  const params = new URLSearchParams(searchParams);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value == null) params.delete(key);
    else params.set(key, String(value));
  });

  return `?${params.toString()}`;
}
