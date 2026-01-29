import { Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function CustomerServicePage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-[hsl(var(--bay))] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Kundtjänst</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Kontakta oss</h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefon</h3>
                    <a 
                      href="tel:0584-444160" 
                      className="text-lg text-primary hover:underline"
                    >
                      0584 - 444 160
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-post</h3>
                    <a 
                      href="mailto:order@nordpellets.se" 
                      className="text-lg text-primary hover:underline"
                    >
                      order@nordpellets.se
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Öppettider</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex justify-between gap-8">
                        <span>Måndag - Torsdag</span>
                        <span>07:30 - 15:30</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Fredag</span>
                        <span>07:30 - 15:00</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Lunchstängt</span>
                        <span>12:00 - 13:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adress</h3>
                    <p className="text-muted-foreground">
                      Nord Pellets AB<br />
                      Org.nr: 556647-9969
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
