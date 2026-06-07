import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Smartphone, Globe, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'card' | 'bank' | 'wallet' | 'international';
  popular?: boolean;
}

const paymentMethods: PaymentMethod[] = [
  // Tarjetas
  {
    id: 'webpay',
    name: 'WebPay (Transbank)',
    description: 'Tarjetas de crédito y débito chilenas',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'card',
    popular: true
  },
  {
    id: 'credit_card',
    name: 'Visa / Mastercard',
    description: 'Tarjetas internacionales',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'card'
  },
  // Transferencias bancarias
  {
    id: 'khipu',
    name: 'Khipu',
    description: 'Transferencia bancaria instantánea',
    icon: <Building2 className="h-5 w-5" />,
    category: 'bank',
    popular: true
  },
  {
    id: 'cuenta_rut',
    name: 'Cuenta RUT',
    description: 'BancoEstado - Cuenta RUT',
    icon: <Building2 className="h-5 w-5" />,
    category: 'bank'
  },
  // Billeteras digitales
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Billetera digital y cuotas sin interés',
    icon: <Smartphone className="h-5 w-5" />,
    category: 'wallet',
    popular: true
  },
  {
    id: 'flow',
    name: 'Flow',
    description: 'Múltiples medios de pago',
    icon: <Smartphone className="h-5 w-5" />,
    category: 'wallet'
  },
  {
    id: 'mach',
    name: 'MACH',
    description: 'Pago con tarjeta prepago',
    icon: <Smartphone className="h-5 w-5" />,
    category: 'wallet'
  },
  {
    id: 'tenpo',
    name: 'Tenpo',
    description: 'Cuenta digital sin comisiones',
    icon: <Smartphone className="h-5 w-5" />,
    category: 'wallet'
  },
  // Internacionales
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pagos internacionales seguros',
    icon: <Globe className="h-5 w-5" />,
    category: 'international'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Tarjetas internacionales',
    icon: <Globe className="h-5 w-5" />,
    category: 'international'
  }
];

const categoryLabels = {
  card: 'Tarjetas',
  bank: 'Transferencia Bancaria',
  wallet: 'Billeteras Digitales',
  international: 'Pagos Internacionales'
};

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
  amount: number;
  productName: string;
}

export function PaymentModal({ 
  open, 
  onOpenChange, 
  onPaymentSuccess,
  amount,
  productName 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Selecciona un método de pago",
        description: "Debes elegir cómo deseas pagar antes de continuar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento de pago (aquí se integraría el proveedor real)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "¡Pago exitoso!",
      description: `Has desbloqueado ${productName} correctamente`,
    });
    
    setIsProcessing(false);
    onPaymentSuccess();
    onOpenChange(false);
  };

  const groupedMethods = paymentMethods.reduce((acc, method) => {
    if (!acc[method.category]) {
      acc[method.category] = [];
    }
    acc[method.category].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Desbloquear Evaluaciones Clínicas</DialogTitle>
          <DialogDescription>
            Acceso permanente a todas las evaluaciones validadas científicamente
          </DialogDescription>
        </DialogHeader>

        {/* Resumen del producto */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{productName}</h3>
                <p className="text-sm text-muted-foreground">
                  PHQ-9, GAD-7, DASS-21, CEAL-SM
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${amount} USD
                </div>
                <p className="text-xs text-muted-foreground">Pago único</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de pago por categoría */}
        <div className="space-y-4">
          {Object.entries(groupedMethods).map(([category, methods]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {methods.map((method) => (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : ''
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedMethod === method.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        {selectedMethod === method.id ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          method.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {method.name}
                          </span>
                          {method.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {method.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botón de pago */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Procesando pago...
              </>
            ) : (
              `Pagar $${amount} USD`
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            🔒 Pago seguro · Sin almacenamiento de datos de tarjeta
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
