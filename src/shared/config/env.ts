function normalizeApiUrl(value: string): string {
  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    throw new Error(
      "Переменная окружения NEXT_PUBLIC_API_URL задана пустой строкой.",
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(normalizedValue);
  } catch {
    throw new Error(
      "Переменная окружения NEXT_PUBLIC_API_URL должна содержать абсолютный URL.",
    );
  }

  return parsedUrl.toString().replace(/\/+$/, "");
}

function getRequiredPublicEnv(
  name: "NEXT_PUBLIC_API_URL",
  value: string | undefined,
): string {
  if (typeof value !== "string") {
    throw new Error(`Не задана обязательная переменная окружения ${name}.`);
  }

  return value;
}

export function createPublicEnv(apiUrl: string | undefined) {
  const normalizedApiUrl = normalizeApiUrl(
    getRequiredPublicEnv("NEXT_PUBLIC_API_URL", apiUrl),
  );

  return {
    apiOrigin: new URL(normalizedApiUrl).origin,
    apiUrl: normalizedApiUrl,
  };
}

export const publicEnv = createPublicEnv(process.env.NEXT_PUBLIC_API_URL);
