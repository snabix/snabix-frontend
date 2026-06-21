import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadBlogPost,
  loadBlogPosts,
} from "@/src/screens/blog/lib/load-blog-content";
import { fallbackBlogPosts } from "@/src/screens/blog/model/fallback-posts";
import type { BlogPost } from "@/src/screens/blog/model/types";

const {
  listRuntimeBlogPostsMock,
  showRuntimeBlogPostMock,
} = vi.hoisted(() => ({
  listRuntimeBlogPostsMock: vi.fn<() => Promise<BlogPost[]>>(),
  showRuntimeBlogPostMock: vi.fn<(slug: string) => Promise<BlogPost>>(),
}));

vi.mock("@/src/screens/blog/api/news-runtime-source", () => ({
  listRuntimeBlogPosts: listRuntimeBlogPostsMock,
  showRuntimeBlogPost: showRuntimeBlogPostMock,
}));

const fallbackPost = fallbackBlogPosts[0];

if (!fallbackPost) {
  throw new Error("Blog fallback fixture must contain at least one post.");
}

const runtimePost: BlogPost = {
  ...fallbackPost,
  slug: "runtime-post",
  title: "Runtime API post",
};

describe("blog content loader", () => {
  beforeEach(() => {
    listRuntimeBlogPostsMock.mockReset();
    showRuntimeBlogPostMock.mockReset();
  });

  it("returns posts from the runtime API source", async () => {
    listRuntimeBlogPostsMock.mockResolvedValue([runtimePost]);

    await expect(loadBlogPosts()).resolves.toEqual([runtimePost]);
  });

  it("uses static posts when runtime list is empty or unavailable", async () => {
    listRuntimeBlogPostsMock.mockResolvedValueOnce([]);

    await expect(loadBlogPosts()).resolves.toBe(fallbackBlogPosts);

    listRuntimeBlogPostsMock.mockRejectedValueOnce(new Error("API unavailable"));

    await expect(loadBlogPosts()).resolves.toBe(fallbackBlogPosts);
  });

  it("returns runtime post detail when API is available", async () => {
    showRuntimeBlogPostMock.mockResolvedValue(runtimePost);

    await expect(loadBlogPost(runtimePost.slug)).resolves.toBe(runtimePost);
  });

  it("falls back by slug and keeps unknown posts missing", async () => {
    showRuntimeBlogPostMock.mockRejectedValue(new Error("API unavailable"));

    await expect(loadBlogPost(fallbackPost.slug)).resolves.toBe(fallbackPost);
    await expect(loadBlogPost("missing-post")).resolves.toBeNull();
  });
});
