"use client";

import { useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationRecommendation {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  reasons?: string;
  market_opportunity?: string;
  ecosystem_strength?: string;
  government_support?: string;
  tax_benefits?: string;
  competition_level?: string;
}

export function LocationMap({ recommendations }: { recommendations: LocationRecommendation[] }) {
  const [selected, setSelected] = useState<LocationRecommendation | null>(null);

  if (!recommendations?.length) return null;

  return (
    <Card>
      <CardHeader><CardTitle>Recommended Locations</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {recommendations.map((r, i) => (
              <div 
                key={`${r.country}-${r.city}`} 
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${selected === r ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'}`}
                onClick={() => setSelected(r)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold leading-tight">{r.city}, {r.country}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">{r.reasons}</p>
              </div>
            ))}
          </div>
          
          <div className="md:col-span-2 h-[500px] w-full overflow-hidden rounded-xl border border-border shadow-sm relative z-0">
            <Map 
              defaultCenter={[recommendations[0].latitude, recommendations[0].longitude]} 
              defaultZoom={2}
              center={selected ? [selected.latitude, selected.longitude] : undefined}
              zoom={selected ? 4 : undefined}
            >
              {recommendations.map((r, i) => (
                <Marker 
                  key={`${r.country}-${r.city}`} 
                  width={40} 
                  anchor={[r.latitude, r.longitude]} 
                  onClick={() => setSelected(r)}
                >
                  <div className="flex flex-col items-center -mt-8">
                    <MapPin className={`h-7 w-7 cursor-pointer drop-shadow-md transition-colors ${selected === r ? 'text-primary scale-125' : 'text-primary/70 hover:text-primary'}`} fill="currentColor" />
                    <span className="mt-0.5 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-bold text-foreground backdrop-blur-sm shadow-sm border border-border">
                      {i + 1}
                    </span>
                  </div>
                </Marker>
              ))}

              {selected && (
                <Overlay anchor={[selected.latitude, selected.longitude]} offset={[125, 140]}>
                  <div className="w-[250px] rounded-lg bg-background p-3 shadow-xl border border-border z-50">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-base text-foreground">{selected.city}, {selected.country}</p>
                      <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{selected.reasons}</p>
                    <div className="mt-3 flex items-center justify-between text-xs border-t border-border pt-2">
                      <span className="font-medium text-foreground">Competition:</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary capitalize">
                        {selected.competition_level}
                      </span>
                    </div>
                  </div>
                </Overlay>
              )}
            </Map>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
