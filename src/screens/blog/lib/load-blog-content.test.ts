import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadBlogPost,
  loadBlogPosts,
} from "@/src/screens/blog/lib/load-blog-content";
import type { BlogPost } from "@/src/screens/blog/model/types";
import { blogPostFixture } from "@/tests/fixtures/blog-post";

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

const runtimePost: BlogPost = {
  ...blogPostFixture,
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

  it("does not replace empty or unavailable runtime list with static posts", async () => {
    listRuntimeBlogPostsMock.mockResolvedValueOnce([]);

    await expect(loadBlogPosts()).resolves.toEqual([]);

    listRuntimeBlogPostsMock.mockRejectedValueOnce(new Error("API unavailable"));

    await expect(loadBlogPosts()).resolves.toEqual([]);
  });

  it("returns runtime post detail when API is available", async () => {
    showRuntimeBlogPostMock.mockResolvedValue(runtimePost);

    await expect(loadBlogPost(runtimePost.slug)).resolves.toBe(runtimePost);
  });

  it("keeps post detail missing when runtime API is unavailable", async () => {
    showRuntimeBlogPostMock.mockRejectedValue(new Error("API unavailable"));

    await expect(loadBlogPost(blogPostFixture.slug)).resolves.toBeNull();
    await expect(loadBlogPost("missing-post")).resolves.toBeNull();
  });
});
