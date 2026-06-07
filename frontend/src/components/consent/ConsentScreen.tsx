import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Heart, Lock, CheckCircle } from "lucide-react";
import mindexaLogo from "@/assets/mindexa-logo-slogan-color.png";
import { LegalDocumentModal } from "./LegalDocumentModal";

interface ConsentScreenProps {
  onAccept: () => void;
}

export function ConsentScreen({ onAccept }: ConsentScreenProps) {
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Logo */}
        <div className="text-center">
          <img 
            src={mindexaLogo} 
            alt="MINDEXA - Cuidamos tu Estabilidad Mental" 
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-primary mb-2">
            Plataforma de Salud Preventiva
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Un espacio simple y confidencial para detenerte un momento, observar cómo te sientes en el trabajo y recibir apoyo cuando lo necesites.
          </p>
        </div>

        {/* Consent Card */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Consentimiento de Uso</CardTitle>
            <CardDescription>
              Antes de continuar, es importante que sepas:
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Key Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    No es una evaluación de desempeño
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    MINDEXA no es una herramienta punitiva ni afecta tu trabajo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Información confidencial
                  </p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    La información que compartes se utiliza exclusivamente para acompañarte y cuidar tu estabilidad mental.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Participación voluntaria
                  </p>
                  <p className="text-xs text-purple-700 mt-0.5">
                    Tu participación es voluntaria y orientada al cuidado preventivo.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground italic">
                "Esto no es una evaluación. Es un momento breve para chequear cómo estás y cuidarte."
              </p>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox 
                id="consent" 
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="mt-1"
              />
              <label 
                htmlFor="consent" 
                className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
              >
                Entiendo que MINDEXA es una herramienta de acompañamiento y cuidado preventivo, 
                no de evaluación ni supervisión laboral. He leído los{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                >
                  Términos y Condiciones
                </button>
                {" "}y la{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                >
                  Política de Privacidad
                </button>.
              </label>
            </div>

            {/* Accept Button */}
            <Button 
              onClick={onAccept}
              disabled={!accepted}
              className="w-full mt-4"
              size="lg"
            >
              Acepto y continúo
            </Button>

            {/* Footer note */}
            <p className="text-xs text-center text-muted-foreground pt-2">
              Cómo te sientes influye en tu energía, tu seguridad y tu día a día. 
              Por eso lo observamos de forma continua y simple.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Legal Document Modals */}
      <LegalDocumentModal 
        open={showTerms} 
        onOpenChange={setShowTerms} 
        type="terms" 
      />
      <LegalDocumentModal 
        open={showPrivacy} 
        onOpenChange={setShowPrivacy} 
        type="privacy" 
      />
    </div>
  );
}
