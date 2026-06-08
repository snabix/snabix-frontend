import { HomePage } from "@/src/screens/home/ui/home-page";

type HomeRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: HomeRouteProps) {
  const params = await searchParams;
  const categoryId = parseCategoryId(params.categoryId);

  return <HomePage initialCategoryId={categoryId} key={categoryId ?? "all"} />;
}

function parseCategoryId(value: string | string[] | undefined): string | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return undefined;
  }

  return rawValue.trim() !== "" ? rawValue : undefined;
}
