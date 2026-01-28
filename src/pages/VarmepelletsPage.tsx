import { useState } from 'react';
import { getProductsByCategory, Product } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { LeadModal } from '@/components/products/LeadModal';

export default function VarmepelletsPage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = getProductsByCategory('varmepellets');

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsLeadModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-[hsl(var(--bay))] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Värmepellets</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Högkvalitativa värmepellets tillverkade av 100% svenskt trä. 
            Effektiv uppvärmning med låg askhalt och högt värmevärde.
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
            <h2 className="text-3xl font-bold mb-6">Om våra värmepellets</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Våra värmepellets tillverkas av rent sågspån och hyvelspån från svenska sågverk. 
              De innehåller inga tillsatser eller bindemedel. Pelletsens höga kvalitet ger en 
              effektiv förbränning med minimalt underhåll av din pelletsbrännare.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">&lt;0.5%</div>
                <div className="text-muted-foreground">Askhalt</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">~17</div>
                <div className="text-muted-foreground">MJ/kg värmevärde</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Svenskt trä</div>
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
