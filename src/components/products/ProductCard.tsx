import { Link } from 'react-router-dom';
import { Package, Ruler, Weight } from 'lucide-react';
import { Product, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onBuyClick?: (product: Product) => void;
}

export function ProductCard({ product, onBuyClick }: ProductCardProps) {
  return (
    <div className="product-card group">
      <Link to={`/produkt/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>{product.specs.shipping}</span>
            </div>
            {product.specs.size && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Ruler className="w-4 h-4" />
                <span>{product.specs.size}</span>
              </div>
            )}
            {product.specs.weight && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Weight className="w-4 h-4" />
                <span>{product.specs.weight}</span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          {product.inStock && (
            <div className="stock-pill stock-pill--available mb-4">
              I lager
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              inkl. moms / {product.unit}
            </div>
          </div>
        </div>
      </Link>

      {/* Buy Button */}
      <div className="px-5 pb-5">
        <button
          onClick={(e) => {
            e.preventDefault();
            onBuyClick?.(product);
          }}
          className="w-full btn-outline"
        >
          Köp produkt
        </button>
      </div>
    </div>
  );
}
