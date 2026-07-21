import { Newspaper } from "lucide-react";
import type { BlogPost } from "@/src/screens/blog/model/types";

export const blogPostFixture: BlogPost = {
  accent: "oat",
  category: "Новости",
  contentBlocks: [
    {
      type: "lead",
      text: "Тестовый материал, который существует только в test tree.",
    },
  ],
  date: "20 июля 2026",
  description: "Fixture для проверки runtime-загрузчика новостей.",
  eyebrow: "Test fixture",
  icon: Newspaper,
  imageUrl: "https://images.example.test/blog-post.jpg",
  slug: "test-blog-post",
  thesis: "Production tree не содержит fallback-контент.",
  title: "Тестовая запись",
};
