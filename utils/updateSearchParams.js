export function updateSearchParams(url, newParams) {
  const urlObj = new URL(url); // Parse the URL

  // Add or update the new search parameters
  Object.entries(newParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  return urlObj.toString(); // Return the updated URL as a string
}
