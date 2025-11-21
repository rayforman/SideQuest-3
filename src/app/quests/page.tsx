"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import QuestCard from "@/components/quest-card";
import BottomNav from "@/components/bottom-nav";
import { Quest } from "@/types/quest";
import { RefreshCw } from "lucide-react";

export default function QuestsPage() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [likedQuests, setLikedQuests] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    checkOnboarding();
    loadQuests();
    loadLikedQuests();
  }, []);

  const checkOnboarding = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!preferences) {
      router.push("/quests/onboarding");
    }
  };

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
    } finally {
      setLoading(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuests();
    setCurrentIndex(0);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = startY.current - currentY.current;
    
    if (diff > 50 && currentIndex < quests.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (diff < -100 && currentIndex === 0) {
      handleRefresh();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading quests...</div>
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <RefreshCw className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No quests available</h2>
        <p className="text-gray-400 text-center mb-6">
          Pull down to refresh and load new quests
        </p>
        <button
          onClick={handleRefresh}
          className="px-6 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Refresh Now
        </button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {refreshing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Refreshing...</span>
        </div>
      )}

      <div
        ref={containerRef}
        className="h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {quests.map((quest, index) => (
          <div
            key={quest.id}
            className="h-screen w-full"
            style={{ height: "100vh" }}
          >
            <QuestCard
              quest={quest}
              onLike={handleLike}
              isLiked={likedQuests.has(quest.id)}
            />
          </div>
        ))}
      </div>

      {/* Scroll indicators */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        {quests.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white h-8"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
