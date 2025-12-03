import Link from "next/link";
import { ArrowUpRight, Check, Compass } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,139,10,0.05)] via-white to-[rgba(255,139,10,0.03)] opacity-70" />
      
      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(255,139,10,0.15)] mb-8">
              <Compass className="w-10 h-10 text-[rgb(255,139,10)]" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Your Next{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(255,139,10)] to-[rgb(255,165,44)]">
                Adventure
              </span>
              {" "}Awaits
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Swipe through AI-powered travel quests. Discover unique destinations, curated itineraries, and unforgettable experiences tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-[rgb(255,139,10)] rounded-lg hover:bg-[rgb(230,125,9)] transition-colors text-lg font-medium"
              >
                Start Exploring
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Plans
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>AI-powered recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Personalized itineraries</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Save your favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
