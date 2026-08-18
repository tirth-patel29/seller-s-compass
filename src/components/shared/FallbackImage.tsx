import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export function FallbackImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-secondary/50 ${className}`}>
        <ImageIcon className="size-1/3 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
