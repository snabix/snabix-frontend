export function formatPhoneNumber(value?: string | null): string {
  if (value === null || value === undefined) {
    return "";
  }

  const digits = value.replace(/\D/g, "");

  if (digits === "") {
    return "";
  }

  const normalizedDigits = normalizeRussianPhoneDigits(digits);

  if (normalizedDigits.length !== 11 || !normalizedDigits.startsWith("7")) {
    return value.trim();
  }

  return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)} - ${normalizedDigits.slice(7, 9)} - ${normalizedDigits.slice(9, 11)}`;
}

export function formatPhoneInputValue(value: string): string {
  const digits = normalizeRussianPhoneDigits(value.replace(/\D/g, "")).slice(0, 11);

  if (digits === "") {
    return "+7";
  }

  const withoutCountryCode = digits.startsWith("7")
    ? digits.slice(1)
    : digits;
  const operator = withoutCountryCode.slice(0, 3);
  const firstPart = withoutCountryCode.slice(3, 6);
  const secondPart = withoutCountryCode.slice(6, 8);
  const thirdPart = withoutCountryCode.slice(8, 10);

  let formatted = "+7";

  if (operator !== "") {
    formatted += ` (${operator}`;
  }

  if (operator.length === 3) {
    formatted += ")";
  }

  if (firstPart !== "") {
    formatted += ` ${firstPart}`;
  }

  if (secondPart !== "") {
    formatted += ` - ${secondPart}`;
  }

  if (thirdPart !== "") {
    formatted += ` - ${thirdPart}`;
  }

  return formatted;
}

export function normalizePhoneInputValue(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const digits = normalizeRussianPhoneDigits(value.replace(/\D/g, "")).slice(0, 11);

  return digits.length === 11 ? `+${digits}` : null;
}

function normalizeRussianPhoneDigits(digits: string): string {
  if (digits.length === 10) {
    return `7${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }

  return digits;
}
