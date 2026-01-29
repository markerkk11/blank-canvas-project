import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Ruler, Weight, Check } from 'lucide-react';
import { getProductById, formatPrice, products, Product } from '@/data/products';
import { LeadModal } from '@/components/products/LeadModal';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductById(slug || '');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produkten hittades inte</h1>
        <Link to="/produkter" className="text-primary hover:underline">
          Tillbaka till produkter
        </Link>
      </div>
    );
  }

  const handleBuyClick = (p: Product) => {
    setSelectedProduct(p);
    setIsLeadModalOpen(true);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4">
          <Link 
            to="/produkter" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till produkter
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-card rounded-2xl p-8 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Stock Status */}
              {product.inStock && (
                <div className="stock-pill stock-pill--available mb-6">
                  I lager
                </div>
              )}

              {/* Specs */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                  <Package className="w-5 h-5 text-primary" />
                  <span>{product.specs.shipping}</span>
                </div>
                {product.specs.size && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                    <Ruler className="w-5 h-5 text-primary" />
                    <span>{product.specs.size}</span>
                  </div>
                )}
                {product.specs.weight && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                    <Weight className="w-5 h-5 text-primary" />
                    <span>{product.specs.weight}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <div className="text-muted-foreground">
                  inkl. moms / {product.unit}
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handleBuyClick(product)}
                className="btn-primary text-lg px-8 py-4"
              >
                Köp produkt
              </button>

              {/* Features */}
              <div className="mt-10 pt-8 border-t">
                <h3 className="font-semibold mb-4">Produktegenskaper</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Tillverkat av 100% svenskt trä</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Hög kvalitet och låg askhalt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Snabb leverans i hela Sverige</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Relaterade produkter</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onBuyClick={handleBuyClick} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setSelectedProduct(null);
        }}
        preselectedProduct={selectedProduct}
      />
    </div>
  );
}
