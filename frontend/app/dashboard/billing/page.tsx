"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/lib/useApiClient";
import { Check } from "lucide-react";

const plans = [
  { id: "free", name: "Free", price: "$0/mo", features: ["1 idea validation / month", "Core market research"] },
  { id: "pro", name: "Pro", price: "$29/mo", features: ["Unlimited validations", "PDF & DOCX reports", "AI advisor chat"] },
  { id: "enterprise", name: "Enterprise", price: "Custom", features: ["Team seats", "Priority support", "SLA"] },
];

export default function BillingPage() {
  const getApi = useApiClient();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleUpgrade(plan: string) {
    if (plan === "free") return;
    setLoadingPlan(plan);
    try {
      const api = await getApi();
      const res = await api.post("/api/subscriptions/checkout", null, { params: { plan } });
      window.location.href = res.data.checkout_url;
    } catch {
      toast.error("Couldn't start checkout. Make sure Stripe keys are configured.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleManage() {
    try {
      const api = await getApi();
      const res = await api.post("/api/subscriptions/portal");
      window.location.href = res.data.portal_url;
    } catch {
      toast.error("No billing account yet — upgrade to a paid plan first.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription plan.</p>
        </div>
        <Button variant="outline" onClick={handleManage}>Manage billing</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.price}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {f}</li>
                ))}
              </ul>
              <Button className="w-full" disabled={p.id === "free" || loadingPlan !== null} onClick={() => handleUpgrade(p.id)}>
                {p.id === "free" ? "Current default" : loadingPlan === p.id ? "Redirecting..." : `Upgrade to ${p.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
