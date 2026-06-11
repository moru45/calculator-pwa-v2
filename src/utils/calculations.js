/**
 * Get the numeric value for a given unit string.
 * @param {string} unit - The unit string (e.g., '100g').
 * @returns {number} The numeric value (e.g., 100).
 */
export const getUnitValue = (unit) => {
    const unitMap = {
        '100g': 100,
        '1kg': 1000,
        '100ml': 100,
        '1L': 1000,
        '100個': 100,
        '1個': 1
    };
    return unitMap[unit] || 1;
};

/**
 * Get the display text for the volume unit.
 * @param {string} unit - The unit string.
 * @returns {string} The display unit (e.g., 'g', 'ml').
 */
export const getVolumeUnitText = (unit) => {
    const unitTextMap = {
        '100g': 'g',
        '1kg': 'g',
        '100ml': 'ml',
        '1L': 'ml',
        '100個': '個',
        '1個': '個'
    };
    return unitTextMap[unit] || '';
};

/**
 * Calculate the unit price.
 * @param {number} price - The price.
 * @param {number} volume - The volume/amount.
 * @param {string} currentUnit - The selected unit.
 * @returns {number|null} The calculated unit price, or null if invalid inputs.
 */
export const calculateUnitPrice = (price, volume, currentUnit) => {
    if (!price || !volume || price <= 0 || volume <= 0) {
        return null;
    }
    const unitValue = getUnitValue(currentUnit);
    if (unitValue > 0) {
        return (price / volume) * unitValue;
    }
    return 0;
};

/**
 * Calculate the discounted price.
 * @param {number} price - The original price.
 * @param {number} discountRate - The discount rate in percentage (0-100).
 * @returns {number|null} The discounted price, or null if invalid inputs.
 */
export const calculateDiscountPrice = (price, discountRate) => {
    if (!price || price <= 0 || discountRate < 0 || discountRate > 100) {
        return null;
    }
    return price * (100 - discountRate) / 100;
};
