"use client";

import { Quest } from "@/types/quest";
import { Heart, MapPin, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onLike: (questId: string) => void;
  isLiked: boolean;
}

export default function QuestCard({ quest, onLike, isLiked }: QuestCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleSingleTap = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDoubleTap = () => {
    onLike(quest.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  let tapTimeout: NodeJS.Timeout | null = null;
  const handleTap = () => {
    if (tapTimeout) {
      clearTimeout(tapTimeout);
      tapTimeout = null;
      handleDoubleTap();
    } else {
      tapTimeout = setTimeout(() => {
        handleSingleTap();
        tapTimeout = null;
      }, 300);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      <div
        className={cn(
          "absolute inset-0 transition-all duration-500 transform-gpu",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleTap}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full">
            <img
              src={quest.cover_image}
              alt={quest.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{quest.destination}</span>
              </div>
              
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                {quest.title}
              </h2>
              
              <p className="text-lg text-white/90 mb-6 line-clamp-2">
                {quest.description}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{quest.budget_level}</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{quest.duration}</span>
                </div>
              </div>
            </div>

            {/* Like button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(quest.id);
              }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Heart
                className={cn(
                  "w-6 h-6",
                  isLiked ? "fill-red-500 text-red-500" : "text-white"
                )}
              />
            </button>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 overflow-y-auto">
            <div className="p-6 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{quest.title}</h3>
                  <p className="text-slate-300">{quest.destination}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">
                    ${quest.total_price.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">{quest.currency}</div>
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-emerald-400">
                  Activities Included
                </h4>
                <div className="space-y-2">
                  {quest.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                    >
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-slate-400">
                          {activity.duration}
                        </div>
                      </div>
                      <div className="font-semibold">${activity.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-emerald-400">
                  Itinerary Highlights
                </h4>
                <div className="space-y-3">
                  {quest.itinerary.slice(0, 3).map((day, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <div className="font-semibold mb-2">
                        Day {day.day}: {day.title}
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {day.activities.map((act, actIdx) => (
                          <li key={actIdx}>• {act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-400">
                Tap to flip back
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heart animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <Heart className="w-32 h-32 fill-red-500 text-red-500 animate-ping" />
        </div>
      )}
    </div>
  );
}
