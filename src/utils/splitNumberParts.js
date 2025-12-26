export default function splitNumberParts(numStr) {
  if (!numStr || numStr.trim() === "") {
    return false;
  }

  const parts = numStr.trim().split(/\s+/);

  let currency = null;
  let numberPart = parts[0];

  if (parts.length > 1) {
    currency = parts[parts.length - 1];
    numberPart = parts.slice(0, parts.length - 1).join(' ');
  }

  if (!numberPart.includes('.')) {
    return {
      integer: numberPart,
      decimal: false,
      currency,
    };
  }

  const [integer, decimal] = numberPart.split('.');
  return {
    integer,
    decimal,
    currency,
  };
}
