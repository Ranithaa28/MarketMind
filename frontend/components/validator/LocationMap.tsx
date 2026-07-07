"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!recommendations?.length) return null;

  if (!token) {
    return (
      <Card>
        <CardHeader><CardTitle>Recommended Locations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Set NEXT_PUBLIC_MAPBOX_TOKEN to render the interactive map. Showing a list instead:
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
        <div className="h-96 w-full overflow-hidden rounded-xl">
          <Map
            mapboxAccessToken={token}
            initialViewState={{ longitude: recommendations[0].longitude, latitude: recommendations[0].latitude, zoom: 1.4 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
          >
            <NavigationControl position="top-right" />
            {recommendations.map((r) => (
              <Marker
                key={`${r.country}-${r.city}`}
                longitude={r.longitude}
                latitude={r.latitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelected(r);
                }}
              >
                <MapPin className="h-6 w-6 cursor-pointer text-primary drop-shadow" fill="currentColor" />
              </Marker>
            ))}
            {selected && (
              <Popup
                longitude={selected.longitude}
                latitude={selected.latitude}
                onClose={() => setSelected(null)}
                closeOnClick={false}
                anchor="bottom"
              >
                <div className="max-w-xs text-sm text-black">
                  <p className="font-semibold">{selected.city}, {selected.country}</p>
                  <p className="mt-1">{selected.reasons}</p>
                  <p className="mt-1"><b>Competition:</b> {selected.competition_level}</p>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </CardContent>
    </Card>
  );
}
