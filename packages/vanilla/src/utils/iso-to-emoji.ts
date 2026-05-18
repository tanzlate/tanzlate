/*
 * From Grafikart: trick to transform an ISO code to an emoji flag
 * https://grafikart.fr/tutoriels/drapeau-emoji-fonction-2152
 * @param {string} code
 */
function isoToEmoji(code: string) {
  return code
    .split('')
    .map((letter) => (letter.charCodeAt(0) % 32) + 0x1f1e5)
    .map((emojiCode) => String.fromCodePoint(emojiCode))
    .join('');
}

export function getFlagEmoji(countryCode: string) {
  return isoToEmoji(countryCode);
}
