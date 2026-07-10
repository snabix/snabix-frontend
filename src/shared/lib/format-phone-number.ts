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
  const nationalDigits = extractRussianNationalDigits(value).slice(0, 10);

  if (nationalDigits === "") {
    return "+7";
  }

  const operator = nationalDigits.slice(0, 3);
  const firstPart = nationalDigits.slice(3, 6);
  const secondPart = nationalDigits.slice(6, 8);
  const thirdPart = nationalDigits.slice(8, 10);

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

  const nationalDigits = extractRussianNationalDigits(value).slice(0, 10);

  return nationalDigits.length === 10 ? `+7${nationalDigits}` : null;
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

function extractRussianNationalDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits === "" || digits === "7" || digits === "8") {
    return "";
  }

  if ((digits.startsWith("7") || digits.startsWith("8")) && digits.length > 1) {
    return digits.slice(1);
  }

  return digits;
}
