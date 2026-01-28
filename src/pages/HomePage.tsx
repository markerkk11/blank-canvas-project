import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products, Product } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { LeadModal } from '@/components/products/LeadModal';
import heroBanner from '@/assets/hero-banner.jpg';

// Import product images for display
import varmepellets6mm from '@/assets/products/varmepellets-6mm.webp';
import varmepellets8mm from '@/assets/products/varmepellets-8mm.webp';
import stropellets from '@/assets/products/stropellets.webp';
import finspan from '@/assets/products/laxa-finspan.webp';

const featuredProducts = products.slice(0, 4);

const categories = [
  {
    name: 'Värmepellets',
    description: 'Högkvalitativa pellets för effektiv uppvärmning',
    href: '/varmepellets',
    image: varmepellets6mm,
  },
  {
    name: 'Ströprodukter',
    description: 'Premium strömaterial för djurhållning',
    href: '/stroprodukter',
    image: stropellets,
  },
];

export default function HomePage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsLeadModalOpen(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>
        
        <div className="relative container mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Laxå värmepellets och ströprodukter
          </h1>
          <p className="text-xl md:text-2xl mb-2 opacity-90">
            Webbshop för privat och företagskunder
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-accent">
            Det naturliga valet!
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/produkter" className="btn-primary bg-white text-primary hover:bg-white/90">
              Se våra produkter
            </Link>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              Begär offert
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <span className="inline-flex items-center gap-2 text-primary font-medium">
                    Se produkter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Våra produkter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Högkvalitativa pellets och ströprodukter tillverkade av rent trä från svenska skogar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={handleBuyClick}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/produkter" className="btn-primary inline-flex items-center gap-2">
              Se alla produkter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Varför välja Laxå Pellets?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <div>
                <div className="text-4xl font-bold text-accent mb-2">20+</div>
                <div className="text-lg">År av erfarenhet</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">100%</div>
                <div className="text-lg">Svenskt trä</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">Snabb</div>
                <div className="text-lg">Leverans i hela Sverige</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Hör av dig till vår kundtjänst
          </h2>
          <p className="text-muted-foreground mb-8">
            Vi hjälper dig gärna med frågor om våra produkter eller din beställning.
          </p>
          <Link to="/kundtjanst" className="btn-primary inline-flex items-center gap-2">
            Kontakta oss
            <ArrowRight className="w-4 h-4" />
          </Link>
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
