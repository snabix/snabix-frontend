import { render, screen } from "@testing-library/react";
import { isRuntimeMediaSource, MediaImage } from "@/src/shared/ui/media-image";

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
});
