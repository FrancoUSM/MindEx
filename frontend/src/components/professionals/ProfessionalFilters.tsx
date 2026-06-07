import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { SPECIALTIES, APPROACHES } from "@/lib/professionals";

export interface FilterState {
  search: string;
  specialties: string[];
  approach: string;
  priceRange: [number, number];
  minRating: number;
  onlyVerified: boolean;
  onlyMindexa: boolean;
}

interface ProfessionalFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

export function ProfessionalFilters({ 
  filters, 
  onFiltersChange, 
  resultCount 
}: ProfessionalFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    filters.specialties.length > 0,
    filters.approach !== '',
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000,
    filters.minRating > 0,
    filters.onlyVerified,
    filters.onlyMindexa,
  ].filter(Boolean).length;

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    onFiltersChange({ ...filters, specialties: newSpecialties });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      specialties: [],
      approach: '',
      priceRange: [0, 100000],
      minRating: 0,
      onlyVerified: false,
      onlyMindexa: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, especialidad..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros de búsqueda</SheetTitle>
              <SheetDescription>
                Encuentra al profesional ideal para tus necesidades
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Especialidades */}
              <div>
                <Label className="text-sm font-medium">Especialidades</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SPECIALTIES.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant={filters.specialties.includes(specialty) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => handleSpecialtyToggle(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Enfoque terapéutico */}
              <div>
                <Label className="text-sm font-medium">Enfoque terapéutico</Label>
                <Select
                  value={filters.approach}
                  onValueChange={(value) => onFiltersChange({ ...filters, approach: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Cualquier enfoque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Cualquier enfoque</SelectItem>
                    {APPROACHES.map((approach) => (
                      <SelectItem key={approach} value={approach}>
                        {approach}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rango de precio */}
              <div>
                <Label className="text-sm font-medium">
                  Rango de precio: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  min={0}
                  max={100000}
                  step={5000}
                  value={filters.priceRange}
                  onValueChange={(value) => 
                    onFiltersChange({ ...filters, priceRange: value as [number, number] })
                  }
                  className="mt-4"
                />
              </div>

              {/* Rating mínimo */}
              <div>
                <Label className="text-sm font-medium">
                  Rating mínimo: {filters.minRating > 0 ? `${filters.minRating}+ estrellas` : 'Sin filtro'}
                </Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[filters.minRating]}
                  onValueChange={(value) => 
                    onFiltersChange({ ...filters, minRating: value[0] })
                  }
                  className="mt-4"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="verified"
                    checked={filters.onlyVerified}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, onlyVerified: checked as boolean })
                    }
                  />
                  <Label htmlFor="verified" className="text-sm cursor-pointer">
                    Solo profesionales verificados
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mindexa"
                    checked={filters.onlyMindexa}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, onlyMindexa: checked as boolean })
                    }
                  />
                  <Label htmlFor="mindexa" className="text-sm cursor-pointer">
                    Acepta trabajadores MINDEXA
                  </Label>
                </div>
              </div>

              {/* Clear filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters & count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resultCount} profesionales encontrados
        </p>
        
        {filters.specialties.length > 0 && (
          <div className="flex gap-1">
            {filters.specialties.slice(0, 3).map((s) => (
              <Badge 
                key={s} 
                variant="secondary" 
                className="text-xs cursor-pointer"
                onClick={() => handleSpecialtyToggle(s)}
              >
                {s}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{filters.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
