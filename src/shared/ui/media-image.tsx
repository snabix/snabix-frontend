import Image, { type ImageProps } from "next/image";

type MediaImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
  unoptimized?: boolean;
};

export const defaultMediaBlurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzInIGhlaWdodD0nMjQnIHZpZXdCb3g9JzAgMCAzMiAyNCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB4Mj0nMScgeTE9JzAnIHkyPScxJz48c3RvcCBzdG9wLWNvbG9yPScjZjFmNWY5Jy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjZGRlN2YwJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0ndXJsKCNnKScgd2lkdGg9JzMyJyBoZWlnaHQ9JzI0Jy8+PC9zdmc+";

export function isRuntimeMediaSource(src: string): boolean {
  return src.startsWith("blob:") || src.startsWith("data:");
}

export function shouldUseDefaultMediaPlaceholder(src: string): boolean {
  return !isRuntimeMediaSource(src);
}

export function MediaImage({
  alt,
  blurDataURL,
  loading,
  placeholder,
  priority,
  src,
  unoptimized,
  ...props
}: MediaImageProps) {
  const shouldUsePlaceholder = placeholder === undefined
    && blurDataURL === undefined
    && shouldUseDefaultMediaPlaceholder(src);

  return (
    <Image
      {...props}
      alt={alt}
      blurDataURL={shouldUsePlaceholder ? defaultMediaBlurDataUrl : blurDataURL}
      loading={loading ?? (priority ? undefined : "lazy")}
      placeholder={shouldUsePlaceholder ? "blur" : placeholder}
      priority={priority}
      src={src}
      unoptimized={unoptimized ?? isRuntimeMediaSource(src)}
    />
  );
}
