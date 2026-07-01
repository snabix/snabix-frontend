import { PackagePlus, Wrench } from "lucide-react";
import {
  LISTING_CONDITION_NEW,
  LISTING_CONDITION_USED,
  LISTING_TYPE_PRODUCT,
  LISTING_TYPE_SERVICE,
} from "@/src/entities/listing";

export const listingTypeCards = [
  {
    icon: PackagePlus,
    title: "Товар",
    description: "Техника, мебель, одежда, запчасти и любые физические позиции.",
    value: LISTING_TYPE_PRODUCT,
  },
  {
    icon: Wrench,
    title: "Услуга",
    description: "Ремонт, монтаж, обучение, перевозки и сервисные предложения.",
    value: LISTING_TYPE_SERVICE,
  },
] as const;

export const conditionOptions = [
  { label: "Новый", value: LISTING_CONDITION_NEW },
  { label: "Б/у", value: LISTING_CONDITION_USED },
] as const;
