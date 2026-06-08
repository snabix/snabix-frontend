import { redirect } from "next/navigation";

type ListingsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsRoute({ searchParams }: ListingsRouteProps) {
  const params = await searchParams;
  const categoryId = parseCategoryId(params.categoryId);

  redirect(categoryId ? `/?categoryId=${encodeURIComponent(categoryId)}` : "/");
}

function parseCategoryId(value: string | string[] | undefined): string | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return undefined;
  }

  return rawValue.trim() !== "" ? rawValue : undefined;
}
