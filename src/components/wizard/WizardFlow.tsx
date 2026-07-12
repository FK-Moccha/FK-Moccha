"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { AssistantBubble } from "./AssistantBubble";
import { ProgressBar } from "./ProgressBar";
import { Step1Destination } from "./steps/Step1Destination";
import { Step2Dates } from "./steps/Step2Dates";
import { Step3Travelers } from "./steps/Step3Travelers";
import { Step4Budget } from "./steps/Step4Budget";
import { Step5Style } from "./steps/Step5Style";
import { Step6Special } from "./steps/Step6Special";
import { initialDraft, isStepValid, TOTAL_STEPS, type WizardDraft } from "./wizardTypes";

const QUESTIONS: Record<number, string> = {
  1: "Wohin soll die Reise gehen, und von wo fliegst du ab?",
  2: "Wann möchtest du reisen? Feste Daten oder flexibel?",
  3: "Wie viele Personen reisen mit?",
  4: "Was ist dein ungefähres Gesamtbudget für Flug und Unterkunft?",
  5: "Was ist dir bei dieser Reise am wichtigsten?",
  6: "Gibt es besondere Anforderungen an die Reise?",
};

export function WizardFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WizardDraft>(initialDraft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update(patch: Partial<WizardDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        destination: draft.destination.trim(),
        origin: draft.origin.trim(),
        openJaw: draft.openJaw,
        dateMode: draft.dateMode,
        startDate: draft.startDate,
        endDate: draft.endDate,
        flexibleDays: draft.flexibleDays,
        adults: draft.adults,
        children: draft.children,
        budgetTotal: draft.bestValue ? null : draft.budgetTotal,
        bestValue: draft.bestValue,
        travelStyles: draft.travelStyles,
        accommodationType: draft.accommodationType,
        specialRequirementChips: draft.specialRequirementChips,
        specialRequirementsText: draft.specialRequirementsText.trim(),
      };

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const storedPassword = window.sessionStorage.getItem("createTripPassword");
      if (storedPassword) headers["x-create-password"] = storedPassword;

      let res = await fetch("/api/trips", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        const password = window.prompt("Dieses Voyage-Board ist geschützt. Bitte Passwort eingeben:");
        if (!password) {
          setSubmitting(false);
          return;
        }
        window.sessionStorage.setItem("createTripPassword", password);
        res = await fetch("/api/trips", {
          method: "POST",
          headers: { ...headers, "x-create-password": password },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Die Reise konnte nicht erstellt werden.");
      }

      const { id } = await res.json();
      setDone(true);
      setTimeout(() => router.push(`/trip/${id}?edit=1`), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
      setSubmitting(false);
    }
  }

  function next() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      void submit();
    }
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  const valid = isStepValid(step, draft);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-16 sm:py-24">
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Neue Reise planen
        </p>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Erzähl mir von deiner Reise
        </h1>
      </div>

      <ProgressBar step={Math.min(step, TOTAL_STEPS)} total={TOTAL_STEPS} />

      {done ? (
        <AssistantBubble>
          Perfekt — ich starte jetzt mit der Recherche. Das kann einen Moment dauern...
        </AssistantBubble>
      ) : (
        <div key={step} className="flex flex-col gap-6 animate-fade-up">
          <AssistantBubble>{QUESTIONS[step]}</AssistantBubble>

          <div className="pl-12">
            {step === 1 && <Step1Destination draft={draft} update={update} />}
            {step === 2 && <Step2Dates draft={draft} update={update} />}
            {step === 3 && <Step3Travelers draft={draft} update={update} />}
            {step === 4 && <Step4Budget draft={draft} update={update} />}
            {step === 5 && <Step5Style draft={draft} update={update} />}
            {step === 6 && <Step6Special draft={draft} update={update} />}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-dark">{error}</p>
      )}

      {!done && (
        <div className="flex items-center justify-between pl-12">
          <Button variant="ghost" onClick={back} disabled={step === 1 || submitting}>
            Zurück
          </Button>
          <Button onClick={next} disabled={!valid || submitting}>
            {submitting
              ? "Wird erstellt..."
              : step === TOTAL_STEPS
                ? "Reise planen"
                : "Weiter"}
          </Button>
        </div>
      )}
    </div>
  );
}
