/**
 * Copy the specified text to clipboard
 * @param {string} text 
 * @returns {Promise<boolean>} promise to return true on success, false otherwise
 */
export default async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true
  } catch (error) {
    console.warn('Failed to copy text: ', error);
    return false
  }
}
