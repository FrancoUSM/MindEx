import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield } from "lucide-react";

interface LegalDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "terms" | "privacy";
}

const TERMS_CONTENT = {
  title: "Términos y Condiciones Generales de Uso – MINDEXA SpA",
  sections: [
    {
      title: "1. Identificación",
      content: "El presente documento regula el acceso y uso de la plataforma digital MINDEXA, operada por MINDEXA SpA, sociedad constituida conforme a las leyes de la República de Chile, en adelante \"MINDEXA\"."
    },
    {
      title: "2. Objeto del Servicio",
      content: "MINDEXA es una plataforma tecnológica de apoyo a la estabilidad mental para personas y organizaciones, que provee herramientas de evaluación, seguimiento, analítica, inteligencia artificial, derivación a profesionales y gestión de información, sin constituir diagnóstico médico ni reemplazar la atención clínica presencial."
    },
    {
      title: "3. Naturaleza No Clínica",
      content: "La información entregada por MINDEXA no constituye diagnóstico, tratamiento médico ni psicológico, sino apoyo, orientación y derivación. El uso de la plataforma no sustituye la relación directa con profesionales de la salud."
    },
    {
      title: "4. Uso de Inteligencia Artificial",
      content: "MINDEXA utiliza algoritmos, modelos predictivos y sistemas de IA para análisis, recomendaciones y mejora continua. El usuario acepta que dichas herramientas son de apoyo y no determinísticas."
    },
    {
      title: "5. Tratamiento y Uso Estratégico de la Información",
      content: "El usuario autoriza expresamente a MINDEXA a recopilar, almacenar, procesar, analizar, anonimizar y utilizar su información personal, psicológica, conductual y operativa para fines de prestación del servicio, investigación, desarrollo, analítica avanzada, mejora de algoritmos, generación de modelos predictivos, estudios estadísticos, benchmarking, prevención de riesgos, desarrollo comercial y estratégico, así como para la creación de productos y servicios derivados, siempre resguardando la confidencialidad y anonimización cuando corresponda."
    },
    {
      title: "6. Uso Corporativo",
      content: "En el caso de empresas, MINDEXA podrá generar reportes agregados, indicadores y analítica poblacional, sin revelar datos individuales identificables, salvo autorización expresa del titular."
    },
    {
      title: "7. Profesionales y Marketplace",
      content: "MINDEXA actúa como intermediario tecnológico entre usuarios y profesionales. La responsabilidad de la atención recae exclusivamente en el profesional tratante. MINDEXA no es prestador directo de servicios clínicos."
    },
    {
      title: "8. Propiedad Intelectual",
      content: "Todo el software, marcas, modelos, contenidos y desarrollos pertenecen a MINDEXA SpA o a sus licenciantes, quedando prohibida su reproducción sin autorización expresa."
    },
    {
      title: "9. Limitación de Responsabilidad",
      content: "MINDEXA no será responsable por decisiones personales, clínicas, laborales u operativas adoptadas en base a la información entregada por la plataforma. El uso es bajo responsabilidad del usuario."
    },
    {
      title: "10. Jurisdicción",
      content: "Este acuerdo se rige por las leyes de la República de Chile. Cualquier controversia será sometida a los tribunales ordinarios de justicia de Santiago de Chile."
    },
    {
      title: "11. Aceptación",
      content: "El uso de la plataforma implica la aceptación expresa, libre e informada de estos Términos y Condiciones."
    }
  ]
};

const PRIVACY_CONTENT = {
  title: "Política de Privacidad y Protección de Datos – MINDEXA SpA",
  sections: [
    {
      title: "1. Responsable del Tratamiento",
      content: "MINDEXA SpA, sociedad constituida conforme a las leyes de la República de Chile, es responsable del tratamiento de los datos personales recopilados a través de la plataforma Mindexa."
    },
    {
      title: "2. Tipo de Datos Tratados",
      content: "Se podrán tratar datos personales, sensibles y de carácter psicológico, conductual, laboral y biométrico, incluyendo evaluaciones, historial de uso, interacciones con IA, datos de navegación y datos proporcionados por empresas usuarias."
    },
    {
      title: "3. Finalidades del Tratamiento",
      content: "Los datos podrán ser utilizados para: prestación del servicio, seguimiento, derivación a profesionales, desarrollo de inteligencia artificial, analítica avanzada, modelos predictivos, investigación y desarrollo, estudios estadísticos, benchmarking, prevención de riesgos, mejora continua de la plataforma, generación de reportes, innovación tecnológica y fines comerciales legítimos de MINDEXA SpA, en forma anonimizada o agregada cuando corresponda."
    },
    {
      title: "4. Consentimiento",
      content: "El usuario otorga consentimiento libre, informado y expreso para el tratamiento de sus datos conforme a esta política, incluyendo su uso para los fines indicados."
    },
    {
      title: "5. Almacenamiento y Transferencia",
      content: "Los datos podrán ser almacenados en infraestructuras en Chile y en el extranjero, incluyendo servicios en la nube (AWS, Azure u otros), pudiendo existir transferencia internacional bajo estándares de seguridad adecuados."
    },
    {
      title: "6. Derechos del Titular",
      content: "El usuario podrá ejercer los derechos de acceso, rectificación, cancelación y oposición conforme a la Ley 19.628, mediante solicitud a soporte@mindexa.cl."
    },
    {
      title: "7. Seguridad de la Información",
      content: "MINDEXA implementa medidas técnicas y organizativas para proteger la confidencialidad, integridad y disponibilidad de la información."
    },
    {
      title: "8. Anonimización y Uso Estadístico",
      content: "Los datos podrán ser anonimizados y utilizados para análisis poblacionales, investigación, desarrollo de productos, modelos de IA y estudios de salud mental, sin identificación directa del titular."
    },
    {
      title: "9. Actualizaciones",
      content: "Esta política podrá ser modificada para adecuarse a cambios legales o tecnológicos, informándose oportunamente a los usuarios."
    },
    {
      title: "10. Aceptación",
      content: "El uso de la plataforma implica la aceptación de esta Política de Privacidad."
    }
  ]
};

export function LegalDocumentModal({ open, onOpenChange, type }: LegalDocumentModalProps) {
  const content = type === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;
  const Icon = type === "terms" ? FileText : Shield;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 bg-slate-900 border-2 border-lime-400/50">
        {/* Header with vibrant gradient */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-lime-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 shadow-lg shadow-lime-400/30">
              <Icon className="h-6 w-6 text-slate-900" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 bg-clip-text text-transparent">
              {content.title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] px-6 py-4">
          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-lime-400/30 transition-colors">
                <h3 className="font-semibold text-lime-300 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {section.title.replace(/^\d+\.\s*/, '')}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed pl-8">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-lime-400/20">
            <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
              MINDEXA SpA — Todos los derechos reservados
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
