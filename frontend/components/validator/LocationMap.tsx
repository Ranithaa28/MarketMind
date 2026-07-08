"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!recommendations?.length) return null;

  if (!apiKey) {
    return (
      <Card>
        <CardHeader><CardTitle>Recommended Locations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to render the interactive map. Showing a list instead:
          </p>
          {recommendations.map((r) => (
            <div key={`${r.country}-${r.city}`} className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium">{r.city}, {r.country}</p>
              <p className="text-muted-foreground">{r.reasons}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Recommended Locations</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
          
          <div className="md:col-span-2 h-96 w-full overflow-hidden rounded-xl border border-border shadow-sm relative">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={{ lat: recommendations[0].latitude, lng: recommendations[0].longitude }}
                defaultZoom={2}
                mapId="marketmind_location_map"
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {recommendations.map((r, i) => (
                  <AdvancedMarker
                    key={`${r.country}-${r.city}`}
                    position={{ lat: r.latitude, lng: r.longitude }}
                    onClick={() => setSelected(r)}
                  >
                    <div className="flex flex-col items-center">
                      <MapPin className={`h-7 w-7 cursor-pointer drop-shadow-md transition-colors ${selected === r ? 'text-primary' : 'text-primary/70 hover:text-primary'}`} fill="currentColor" />
                      <span className="mt-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-bold text-foreground backdrop-blur-sm">
                        {i + 1}
                      </span>
                    </div>
                  </AdvancedMarker>
                ))}

                {selected && (
                  <InfoWindow
                    position={{ lat: selected.latitude, lng: selected.longitude }}
                    onCloseClick={() => setSelected(null)}
                  >
                    <div className="max-w-[250px] text-sm text-foreground bg-background p-1">
                      <p className="font-semibold text-base">{selected.city}, {selected.country}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{selected.reasons}</p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-medium">Competition:</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary capitalize">
                          {selected.competition_level}
                        </span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
