import { useState } from 'react';
import { getProductsByCategory, Product } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { LeadModal } from '@/components/products/LeadModal';

export default function StroprodukterPage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = getProductsByCategory('stroprodukter');

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsLeadModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-[hsl(var(--bay))] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ströprodukter</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Premium strömaterial för djurhållning. Våra ströprodukter är extremt 
            absorberande och dammfria för optimal komfort för dina djur.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={handleBuyClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Om våra ströprodukter</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Våra ströprodukter är perfekta för hästar, grisar, kor och andra djur. 
              De är tillverkade av rent svenskt trä och är fria från skadliga tillsatser. 
              Den höga absorptionsförmågan håller underlaget torrt och bekvämt.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">Dammfritt</div>
                <div className="text-muted-foreground">Skonsamt för luftvägar</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">Absorberande</div>
                <div className="text-muted-foreground">Håller underlaget torrt</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">Naturligt</div>
                <div className="text-muted-foreground">100% rent trä</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
