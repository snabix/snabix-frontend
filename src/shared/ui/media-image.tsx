import Image, { type ImageProps } from "next/image";

type MediaImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
  unoptimized?: boolean;
};

export function isRuntimeMediaSource(src: string): boolean {
  return src.startsWith("blob:") || src.startsWith("data:");
}

export function MediaImage({
  alt,
  src,
  unoptimized,
  ...props
}: MediaImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      src={src}
      unoptimized={unoptimized ?? isRuntimeMediaSource(src)}
    />
  );
}
