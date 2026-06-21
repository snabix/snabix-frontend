import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";

describe("Logo", () => {
  it("renders mutually exclusive images for light and dark themes", () => {
    render(<Logo variant="wordmark" />);

    const lightLogo = screen.getByRole("img", { name: "SNABIX" });
    const darkLogo = document.querySelector('img[src="/snabix-white.png"]');

    expect(lightLogo).toHaveAttribute(
      "src",
      "/snabix-black.png",
    );
    expect(lightLogo).toHaveClass("dark:hidden");
    expect(darkLogo).toHaveClass("hidden", "dark:block");
  });
});
