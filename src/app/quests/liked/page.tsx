"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import QuestCard from "@/components/quest-card";
import BottomNav from "@/components/bottom-nav";
import { Quest } from "@/types/quest";
import { Heart } from "lucide-react";

export default function LikedQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [likedQuests, setLikedQuests] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedQuests();
  }, []);

  const loadLikedQuests = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: liked, error: likedError } = await supabase
        .from("liked_quests")
        .select("quest_id")
        .eq("user_id", user.id);

      if (likedError) throw likedError;

      const questIds = liked?.map((item) => item.quest_id) || [];
      setLikedQuests(new Set(questIds));

      if (questIds.length > 0) {
        const { data: questsData, error: questsError } = await supabase
          .from("quests")
          .select("*")
          .in("id", questIds);

        if (questsError) throw questsError;
        setQuests(questsData || []);
      }
    } catch (error) {
      console.error("Error loading liked quests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (questId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
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

      setQuests((prev) => prev.filter((q) => q.id !== questId));
      
      if (currentIndex >= quests.length - 1 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <Heart className="w-24 h-24 mb-6 text-gray-400" />
        <h2 className="text-3xl font-bold mb-3">No liked quests yet</h2>
        <p className="text-gray-400 text-center mb-8 max-w-md">
          Start exploring and double-tap on quests you love to save them here
        </p>
        <a
          href="/quests"
          className="px-6 py-3 bg-[rgb(255,139,10)] rounded-full font-semibold hover:bg-[rgb(230,125,9)] transition-colors"
        >
          Explore Quests
        </a>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <div
        className="h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
        }}
      >
        {quests.map((quest) => (
          <div key={quest.id} className="h-screen w-full">
            <QuestCard
              quest={quest}
              onLike={handleLike}
              isLiked={likedQuests.has(quest.id)}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {quests.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-40"
            >
              <span className="text-white text-2xl">↑</span>
            </button>
          )}
          {currentIndex < quests.length - 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-40"
            >
              <span className="text-white text-2xl">↓</span>
            </button>
          )}
        </>
      )}

      {/* Scroll indicators */}
      {quests.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
          {quests.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white h-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
