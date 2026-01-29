import { Link } from 'react-router-dom';
import { ArrowRight, Award, Leaf, Truck, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-[hsl(var(--bay))] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Om Nord Pellets</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Nord Pellets har i över 20 år levererat högkvalitativa pellets och 
                ströprodukter till privatkunder och företag i hela Sverige. Vi är 
                stolta över vår svenska produktion och vårt engagemang för hållbarhet.
              </p>

              {/* Values */}
              <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hållbarhet</h3>
                  <p className="text-muted-foreground">
                    Vi använder endast restprodukter från svensk skogsindustri, 
                    vilket gör våra produkter klimatsmarta och hållbara.
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kvalitet</h3>
                  <p className="text-muted-foreground">
                    Våra produkter genomgår noggranna kvalitetskontroller för att 
                    säkerställa högsta möjliga standard.
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Leverans</h3>
                  <p className="text-muted-foreground">
                    Vi erbjuder snabb och pålitlig leverans till hela Sverige, 
                    oavsett om du är privatperson eller företag.
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Service</h3>
                  <p className="text-muted-foreground">
                    Vår kunniga personal finns alltid tillgänglig för att hjälpa 
                    dig hitta rätt produkt för dina behov.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-4">Vår historia</h2>
              <p className="text-muted-foreground mb-6">
                Sedan starten har Nord Pellets vuxit från en liten lokal producent 
                till en av Sveriges ledande leverantörer av pellets och ströprodukter. 
                Vår framgång bygger på ett starkt engagemang för kvalitet, 
                kundnöjdhet och hållbar produktion.
              </p>
              <p className="text-muted-foreground mb-6">
                År 2024 firade vi 20 år i branschen, vilket vi markerade med nya 
                förpackningar och utökade produktsortiment. Vi ser fram emot att 
                fortsätta leverera det naturliga valet för värme och djurhållning 
                i många år framöver.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Har du frågor?</h3>
              <p className="opacity-90 mb-6">
                Kontakta vår kundtjänst så hjälper vi dig gärna!
              </p>
              <Link 
                to="/kundtjanst" 
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Kontakta oss
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
