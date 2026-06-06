const INTEGER_MONEY_PATTERN = /^\d+$/;

export function normalizeIntegerMoneyInput(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

export function parseIntegerMoney(value: string): number | null {
  const normalizedValue = normalizeIntegerMoneyInput(value);

  if (normalizedValue === "") {
    return null;
  }

  if (!INTEGER_MONEY_PATTERN.test(normalizedValue)) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

export function isValidIntegerMoney(value: string): boolean {
  return value.trim() === "" || parseIntegerMoney(value) !== null;
}

