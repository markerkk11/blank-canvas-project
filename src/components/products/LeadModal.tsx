import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { products, Product, formatPrice } from '@/data/products';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
}

interface ProductSelection {
  productId: string;
  quantity: number;
}

export function LeadModal({ isOpen, onClose, preselectedProduct }: LeadModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selections, setSelections] = useState<ProductSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setPhone('');
      setMessage('');
      setSelections(preselectedProduct 
        ? [{ productId: preselectedProduct.id, quantity: 1 }]
        : []
      );
      setIsSuccess(false);
      setErrors({});
    }
  }, [isOpen, preselectedProduct]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleProduct = (productId: string) => {
    setSelections(prev => {
      const existing = prev.find(s => s.productId === productId);
      if (existing) {
        return prev.filter(s => s.productId !== productId);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelections(prev => 
      prev.map(s => s.productId === productId ? { ...s, quantity } : s)
    );
  };

  const getTotal = () => {
    return selections.reduce((total, sel) => {
      const product = products.find(p => p.id === sel.productId);
      return total + (product?.price || 0) * sel.quantity;
    }, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = 'Förnamn krävs';
    if (!lastName.trim()) newErrors.lastName = 'Efternamn krävs';
    if (!phone.trim()) newErrors.phone = 'Telefonnummer krävs';
    if (selections.length === 0) newErrors.products = 'Välj minst en produkt';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const data = {
      firstname: firstName,
      lastname: lastName,
      phone,
      products: selections.map(sel => {
        const product = products.find(p => p.id === sel.productId)!;
        return {
          name: product.name,
          quantity: sel.quantity,
          unit: product.unit,
        };
      }),
      message,
      totalPrice: formatPrice(getTotal()),
    };

    try {
      await fetch('https://uisrdborglycmwhdrouo.supabase.co/functions/v1/send-telegram-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error sending lead:', error);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleNewOrder = () => {
    setIsSuccess(false);
    setFirstName('');
    setLastName('');
    setPhone('');
    setMessage('');
    setSelections([]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Stäng"
        >
          <X className="w-6 h-6" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tack för din förfrågan!</h3>
            <p className="text-muted-foreground mb-6">
              Vi återkommer till dig så snart som möjligt med en offert.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleNewOrder} className="btn-outline">
                Ny beställning
              </button>
              <button onClick={onClose} className="btn-primary">
                Stäng
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Skicka köpförfrågan</h2>
              <p className="text-muted-foreground mt-1">
                Fyll i formuläret så kontaktar vi dig med en offert.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Förnamn *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.replace(/[0-9]/g, ''))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.firstName ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Efternamn *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.replace(/[0-9]/g, ''))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.lastName ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Telefonnummer *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[a-zA-ZÀ-ÿ]/g, ''))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.phone ? 'border-destructive' : 'border-input'
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Välj produkter och antal *</label>
                {errors.products && (
                  <p className="text-sm text-destructive mb-2">{errors.products}</p>
                )}
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                  {products.map((product) => {
                    const selection = selections.find(s => s.productId === product.id);
                    const isSelected = !!selection;

                    return (
                      <div
                        key={product.id}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-transparent bg-secondary'
                        }`}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product.id)}
                            className="mt-1 w-4 h-4 text-primary rounded border-input focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatPrice(product.price)}/{product.unit}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="number"
                                  value={selection.quantity}
                                  onChange={(e) => updateQuantity(product.id, parseFloat(e.target.value) || 1)}
                                  onBlur={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (isNaN(val) || val < 0.1) {
                                      updateQuantity(product.id, 1);
                                    }
                                  }}
                                  min="0.1"
                                  step="0.1"
                                  className="w-20 px-2 py-1 text-sm border rounded"
                                />
                                <span className="text-sm text-muted-foreground">{product.unit}</span>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              {selections.length > 0 && (
                <div className="flex justify-between items-center py-3 px-4 bg-secondary rounded-lg">
                  <span className="font-medium">Totalt ordervärde:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(getTotal())}</span>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">Övrig information</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Ange eventuell extra information om din beställning..."
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Skickar...' : 'Skicka förfrågan'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
