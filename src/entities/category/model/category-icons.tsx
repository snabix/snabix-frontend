import {
  Baby,
  BriefcaseBusiness,
  Building2,
  Car,
  Drill,
  Home,
  Laptop,
  LucideIcon,
  Shirt,
  Sofa,
  Store,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import type { CategoryNode } from "@/src/entities/category/model/types";

const iconRules: Array<{
  icon: LucideIcon;
  keywords: string[];
}> = [
  { icon: Building2, keywords: ["недвиж", "квартир", "дом"] },
  { icon: Car, keywords: ["авто", "транспорт", "машин"] },
  { icon: Laptop, keywords: ["электрон", "техник", "компьют", "телефон"] },
  { icon: Wrench, keywords: ["услуг", "ремонт", "мастер"] },
  { icon: BriefcaseBusiness, keywords: ["работ", "ваканс", "бизнес"] },
  { icon: Sofa, keywords: ["мебел", "для дома", "интерьер"] },
  { icon: Shirt, keywords: ["одеж", "обув", "аксессуар"] },
  { icon: Baby, keywords: ["дет", "ребен", "игруш"] },
  { icon: Drill, keywords: ["стро", "материал", "инструмент"] },
  { icon: Home, keywords: ["сад", "дач", "хозяй"] },
];

export function getCategoryIcon(category: Pick<CategoryNode, "name" | "slug">): LucideIcon {
  const normalizedValue = `${category.name} ${category.slug}`.toLowerCase();
  const matchedRule = iconRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedValue.includes(keyword)),
  );

  return matchedRule?.icon ?? Store;
}

export function renderCategoryIcon(
  category: Pick<CategoryNode, "name" | "slug">,
  size = 18,
): ReactNode {
  const normalizedValue = `${category.name} ${category.slug}`.toLowerCase();

  if (includesAny(normalizedValue, ["недвиж", "квартир", "дом"])) return <Building2 size={size} />;
  if (includesAny(normalizedValue, ["авто", "транспорт", "машин"])) return <Car size={size} />;
  if (includesAny(normalizedValue, ["электрон", "техник", "компьют", "телефон"])) return <Laptop size={size} />;
  if (includesAny(normalizedValue, ["услуг", "ремонт", "мастер"])) return <Wrench size={size} />;
  if (includesAny(normalizedValue, ["работ", "ваканс", "бизнес"])) return <BriefcaseBusiness size={size} />;
  if (includesAny(normalizedValue, ["мебел", "для дома", "интерьер"])) return <Sofa size={size} />;
  if (includesAny(normalizedValue, ["одеж", "обув", "аксессуар"])) return <Shirt size={size} />;
  if (includesAny(normalizedValue, ["дет", "ребен", "игруш"])) return <Baby size={size} />;
  if (includesAny(normalizedValue, ["стро", "материал", "инструмент"])) return <Drill size={size} />;
  if (includesAny(normalizedValue, ["сад", "дач", "хозяй"])) return <Home size={size} />;

  return <Store size={size} />;
}

function includesAny(value: string, keywords: string[]): boolean {
  return keywords.some((keyword) => value.includes(keyword));
}
