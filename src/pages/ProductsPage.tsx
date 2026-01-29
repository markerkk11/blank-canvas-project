import { useState } from 'react';
import { products, Product, getProductsByCategory } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { LeadModal } from '@/components/products/LeadModal';

type FilterCategory = 'all' | 'varmepellets' | 'stroprodukter';

export default function ProductsPage() {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsLeadModalOpen(true);
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : getProductsByCategory(filter);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-[hsl(var(--bay))] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Våra produkter</h1>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Filtrera på produkttyp</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setFilter('stroprodukter')}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'stroprodukter' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    Ströprodukter
                  </button>
                  <button
                    onClick={() => setFilter('varmepellets')}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'varmepellets' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    Värmepellets
                  </button>
                  <button
                    onClick={() => setFilter('all')}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'all' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    Visa alla
                  </button>
                </nav>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyClick={handleBuyClick}
                  />
                ))}
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
