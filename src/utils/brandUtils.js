/**
 * Normalize brand name for consistent comparison
 * @param {string} brandName - The brand name to normalize
 * @returns {string} - Normalized brand name
 */
export const normalizeBrandName = (brandName) => {
  if (!brandName) return '';
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Create URL-safe path for brand profile
 * @param {string} brandName - The brand name to convert to path
 * @returns {string} - URL-safe path
 */
export const createBrandProfilePath = (brandName) => {
  if (!brandName) return '/nft-brand-profile';
  const normalizedName = normalizeBrandName(brandName);
  return `/nft-brand-profile/${normalizedName}`;
};

/**
 * Compare two brand names for matching
 * @param {string} name1 - First brand name
 * @param {string} name2 - Second brand name
 * @returns {boolean} - True if names match
 */
export const brandNamesMatch = (name1, name2) => {
  return normalizeBrandName(name1) === normalizeBrandName(name2);
};
