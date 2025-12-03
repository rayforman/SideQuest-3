"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import QuestCard from "@/components/quest-card";
import BottomNav from "@/components/bottom-nav";
import { Quest } from "@/types/quest";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "nature",
  "nightlife",
  "culture",
  "history",
  "adventure",
  "beach",
  "food",
  "wellness",
  "city",
  "wine",
  "hiking",
];

const durations = [
  { id: "weekend", label: "Weekend", min: 2, max: 3 },
  { id: "5days", label: "5 Days", min: 4, max: 6 },
  { id: "2weeks", label: "2 Weeks", min: 7, max: 14 },
];

const budgets = ["$", "$$", "$$$"];

export default function SearchPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [likedQuests, setLikedQuests] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadQuests();
    loadLikedQuests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quests, searchQuery, selectedCategories, selectedDuration, selectedBudget]);

  const loadQuests = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuests(data || []);
    } catch (error) {
      console.error("Error loading quests:", error);
    }
  };

  const loadLikedQuests = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("liked_quests")
        .select("quest_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setLikedQuests(new Set(data?.map((item) => item.quest_id) || []));
    } catch (error) {
      console.error("Error loading liked quests:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...quests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (quest) =>
          quest.title.toLowerCase().includes(query) ||
          quest.description.toLowerCase().includes(query) ||
          quest.destination.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((quest) =>
        quest.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    if (selectedDuration) {
      const duration = durations.find((d) => d.id === selectedDuration);
      if (duration) {
        filtered = filtered.filter(
          (quest) =>
            quest.duration_days >= duration.min &&
            quest.duration_days <= duration.max
        );
      }
    }

    if (selectedBudget) {
      filtered = filtered.filter((quest) => quest.budget_level === selectedBudget);
    }

    setFilteredQuests(filtered);
    setCurrentIndex(0);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedDuration("");
    setSelectedBudget("");
  };

  const handleLike = async (questId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (likedQuests.has(questId)) {
        await supabase
          .from("liked_quests")
          .delete()
          .eq("user_id", user.id)
          .eq("quest_id", questId);

        setLikedQuests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(questId);
          return newSet;
        });
      } else {
        await supabase.from("liked_quests").insert({
          user_id: user.id,
          quest_id: questId,
        });

        setLikedQuests((prev) => new Set(prev).add(questId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedDuration ||
    selectedBudget;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Search and Filters */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 space-y-4 overflow-y-auto max-h-[50vh]">
        {/* Search bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search destinations, activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Categories */}
        <div>
          <div className="text-sm font-semibold mb-2 text-gray-700">
            Categories
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={
                  selectedCategories.includes(category) ? "default" : "outline"
                }
                className={cn(
                  "cursor-pointer capitalize",
                  selectedCategories.includes(category) &&
                    "bg-[rgb(255,139,10)] hover:bg-[rgb(230,125,9)]"
                )}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="text-sm font-semibold mb-2 text-gray-700">
            Duration
          </div>
          <div className="flex gap-2">
            {durations.map((duration) => (
              <Badge
                key={duration.id}
                variant={selectedDuration === duration.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer",
                  selectedDuration === duration.id &&
                    "bg-[rgb(255,139,10)] hover:bg-[rgb(230,125,9)]"
                )}
                onClick={() =>
                  setSelectedDuration(
                    selectedDuration === duration.id ? "" : duration.id
                  )
                }
              >
                {duration.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className="text-sm font-semibold mb-2 text-gray-700">Budget</div>
          <div className="flex gap-2">
            {budgets.map((budget) => (
              <Badge
                key={budget}
                variant={selectedBudget === budget ? "default" : "outline"}
                className={cn(
                  "cursor-pointer",
                  selectedBudget === budget && "bg-[rgb(255,139,10)] hover:bg-[rgb(230,125,9)]"
                )}
                onClick={() =>
                  setSelectedBudget(selectedBudget === budget ? "" : budget)
                }
              >
                {budget}
              </Badge>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-[rgb(255,139,10)] hover:text-[rgb(230,125,9)] font-medium"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-600">
          {filteredQuests.length} quest{filteredQuests.length !== 1 ? "s" : ""}{" "}
          found
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {filteredQuests.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white p-6">
            <SearchIcon className="w-16 h-16 mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No quests found</h2>
            <p className="text-gray-400 text-center">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div
            className="h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(-${currentIndex * 100}%)`,
            }}
          >
            {filteredQuests.map((quest) => (
              <div key={quest.id} className="h-full w-full">
                <QuestCard
                  quest={quest}
                  onLike={handleLike}
                  isLiked={likedQuests.has(quest.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation arrows */}
        {filteredQuests.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-40"
              >
                <span className="text-white text-2xl">↑</span>
              </button>
            )}
            {currentIndex < filteredQuests.length - 1 && (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-40"
              >
                <span className="text-white text-2xl">↓</span>
              </button>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
