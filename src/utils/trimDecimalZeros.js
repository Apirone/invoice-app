export default function trimDecimalZeros(input) {
  if (!input || typeof input !== 'string') return '';

  const match = input.match(/(\d+(\.\d+)?)/);
  if (!match) return input;

  const rawNum = match[0];

  let trimmed = rawNum
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '.0')
    .replace(/\.$/, '');

  if (!trimmed.includes('.')) {
    trimmed += '.0';
  }

  return input.replace(rawNum, trimmed);
}
