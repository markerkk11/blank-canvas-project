import { Link } from 'react-router-dom';
import { Check, ArrowLeft, Phone } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tack för din förfrågan!
          </h1>

          {/* Message */}
          <p className="text-lg text-muted-foreground mb-8">
            Vi har tagit emot din beställning och återkommer till dig så snart som möjligt med en offert.
          </p>

          {/* Contact Info */}
          <div className="bg-secondary rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Phone className="w-5 h-5" />
              <span>Har du frågor? Ring oss på</span>
            </div>
            <a 
              href="tel:+46101992270" 
              className="text-xl font-semibold text-primary hover:underline"
            >
              010-199 22 70
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/produkter" className="btn-outline inline-flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till produkter
            </Link>
            <Link to="/" className="btn-primary">
              Till startsidan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
