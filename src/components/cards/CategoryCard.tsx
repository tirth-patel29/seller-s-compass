import { Link } from "@tanstack/react-router";
import { getCategoryImage } from "@/data/assets";

interface CategoryCardProps {
  name: string;
  description: string;
  productCount: number;
  slug: string;
}

export function CategoryCard({ name, description, productCount, slug }: CategoryCardProps) {
  return (
    <Link
      to="/categories/$slug"
      params={{ slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface">
        <img
          src={getCategoryImage(name)}
          alt={name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <p className="mt-auto pt-2 text-xs font-medium text-primary">
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </p>
      </div>
    </Link>
  );
}
