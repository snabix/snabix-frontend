import { render, screen } from "@testing-library/react";
import {
  defaultMediaBlurDataUrl,
  isRuntimeMediaSource,
  MediaImage,
  shouldUseDefaultMediaPlaceholder,
} from "@/src/shared/ui/media-image";

describe("MediaImage", () => {
  it.each(["blob:avatar-preview", "data:image/png;base64,aW1hZ2U="]) (
    "bypasses optimization for runtime source %s",
    (src) => {
      expect(isRuntimeMediaSource(src)).toBe(true);
    },
  );

  it("keeps regular remote media eligible for optimization", () => {
    expect(isRuntimeMediaSource("https://api.snabix.test/storage/image.jpg")).toBe(false);
  });

  it("uses the shared placeholder only for optimizable media", () => {
    expect(shouldUseDefaultMediaPlaceholder("https://api.snabix.test/storage/image.jpg")).toBe(true);
    expect(shouldUseDefaultMediaPlaceholder("blob:avatar-preview")).toBe(false);
    expect(defaultMediaBlurDataUrl).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("renders runtime previews without rewriting their source", () => {
    render(
      <MediaImage
        alt="Предпросмотр"
        height={100}
        src="data:image/png;base64,aW1hZ2U="
        width={100}
      />,
    );

    expect(screen.getByRole("img", { name: "Предпросмотр" })).toHaveAttribute(
      "src",
      "data:image/png;base64,aW1hZ2U=",
    );
  });

  it("defaults optimizable media to lazy loading", () => {
    render(
      <MediaImage
        alt="Фото объявления"
        height={100}
        src="https://api.snabix.test/storage/image.jpg"
        width={100}
      />,
    );

    expect(screen.getByRole("img", { name: "Фото объявления" })).toHaveAttribute(
      "loading",
      "lazy",
    );
  });
});
