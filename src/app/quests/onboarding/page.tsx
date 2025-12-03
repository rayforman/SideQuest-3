"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "../../../../supabase/client";
import { Compass, MapPin, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const interests = [
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "nightlife", label: "Nightlife", emoji: "🎉" },
  { id: "culture", label: "Culture", emoji: "🎭" },
  { id: "history", label: "History", emoji: "🏛️" },
  { id: "adventure", label: "Adventure", emoji: "⛰️" },
  { id: "beach", label: "Beach", emoji: "🏖️" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "wellness", label: "Wellness", emoji: "🧘" },
];

const budgetLevels = [
  { id: "$", label: "Budget", range: "Under $1000" },
  { id: "$$", label: "Moderate", range: "$1000-$2500" },
  { id: "$$$", label: "Luxury", range: "$2500+" },
];

const durations = [
  { id: "weekend", label: "Weekend", days: "2-3 days" },
  { id: "5days", label: "5 Days", days: "4-6 days" },
  { id: "2weeks", label: "2 Weeks", days: "7-14 days" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [homeLocation, setHomeLocation] = useState("");
  const [budgetPreference, setBudgetPreference] = useState("");
  const [durationPreference, setDurationPreference] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        interests: selectedInterests,
        home_location: homeLocation,
        budget_preference: budgetPreference,
        duration_preference: durationPreference,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      router.push("/quests");
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgba(255,139,10,0.05)] via-white to-[rgba(255,139,10,0.03)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-2 rounded-full mx-1 transition-colors",
                s <= step ? "bg-[rgb(255,139,10)]" : "bg-gray-200"
              )}
            />
          ))}
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Compass className="w-16 h-16 text-[rgb(255,139,10)] mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">What interests you?</h1>
              <p className="text-gray-600">
                Select all that apply to personalize your quest feed
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all hover:scale-105",
                    selectedInterests.includes(interest.id)
                      ? "border-[rgb(255,139,10)] bg-[rgba(255,139,10,0.1)]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="text-3xl mb-2">{interest.emoji}</div>
                  <div className="font-medium text-sm">{interest.label}</div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={selectedInterests.length === 0}
              className="w-full h-12 text-lg"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Home Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-16 h-16 text-[rgb(255,139,10)] mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Where are you based?</h1>
              <p className="text-gray-600">
                We'll use this to suggest quests from your location
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-lg">
                Home Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., New York, USA"
                value={homeLocation}
                onChange={(e) => setHomeLocation(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!homeLocation}
                className="flex-1 h-12"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-16 h-16 text-[rgb(255,139,10)] mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">What's your budget?</h1>
              <p className="text-gray-600">Choose your preferred price range</p>
            </div>

            <div className="space-y-3">
              {budgetLevels.map((budget) => (
                <button
                  key={budget.id}
                  onClick={() => setBudgetPreference(budget.id)}
                  className={cn(
                    "w-full p-6 rounded-xl border-2 transition-all text-left hover:scale-[1.02]",
                    budgetPreference === budget.id
                      ? "border-[rgb(255,139,10)] bg-[rgba(255,139,10,0.1)]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {budget.id}
                      </div>
                      <div className="font-medium">{budget.label}</div>
                      <div className="text-sm text-gray-600">
                        {budget.range}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!budgetPreference}
                className="flex-1 h-12"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Duration */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Clock className="w-16 h-16 text-[rgb(255,139,10)] mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Trip duration?</h1>
              <p className="text-gray-600">
                How long do you typically travel for?
              </p>
            </div>

            <div className="space-y-3">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() => setDurationPreference(duration.id)}
                  className={cn(
                    "w-full p-6 rounded-xl border-2 transition-all text-left hover:scale-[1.02]",
                    durationPreference === duration.id
                      ? "border-[rgb(255,139,10)] bg-[rgba(255,139,10,0.1)]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="font-bold text-xl mb-1">{duration.label}</div>
                  <div className="text-gray-600">{duration.days}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!durationPreference || loading}
                className="flex-1 h-12"
              >
                {loading ? "Saving..." : "Get Started"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
