CREATE TABLE IF NOT EXISTS public.user_preferences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    interests text[] DEFAULT '{}',
    home_location text,
    budget_preference text,
    duration_preference text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.quests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    cover_image text NOT NULL,
    budget_level text NOT NULL,
    duration text NOT NULL,
    duration_days integer,
    total_price numeric(10, 2),
    currency text DEFAULT 'USD',
    destination text,
    activities jsonb DEFAULT '[]',
    itinerary jsonb DEFAULT '[]',
    categories text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.liked_quests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id uuid REFERENCES public.quests(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, quest_id)
);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS quests_budget_level_idx ON public.quests(budget_level);
CREATE INDEX IF NOT EXISTS quests_duration_idx ON public.quests(duration);
CREATE INDEX IF NOT EXISTS quests_categories_idx ON public.quests USING GIN(categories);
CREATE INDEX IF NOT EXISTS liked_quests_user_id_idx ON public.liked_quests(user_id);
CREATE INDEX IF NOT EXISTS liked_quests_quest_id_idx ON public.liked_quests(quest_id);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view quests" ON public.quests;
CREATE POLICY "Anyone can view quests" ON public.quests
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own liked quests" ON public.liked_quests;
CREATE POLICY "Users can view own liked quests" ON public.liked_quests
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own liked quests" ON public.liked_quests;
CREATE POLICY "Users can insert own liked quests" ON public.liked_quests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own liked quests" ON public.liked_quests;
CREATE POLICY "Users can delete own liked quests" ON public.liked_quests
    FOR DELETE USING (auth.uid() = user_id);

INSERT INTO public.quests (title, description, cover_image, budget_level, duration, duration_days, total_price, destination, activities, itinerary, categories) VALUES
('Pirates of the Caribbean', 'Sail the turquoise waters and explore hidden coves in the Caribbean islands', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', '$$$', '7 days', 7, 2499.00, 'Caribbean Islands', 
'[{"name": "Snorkeling Adventure", "duration": "3 hours", "price": 89}, {"name": "Sunset Sailing", "duration": "2 hours", "price": 120}, {"name": "Island Hopping Tour", "duration": "Full day", "price": 150}]',
'[{"day": 1, "title": "Arrival & Beach Welcome", "activities": ["Check-in at resort", "Welcome dinner", "Beach sunset walk"]}, {"day": 2, "title": "Snorkeling & Water Sports", "activities": ["Morning snorkeling", "Lunch at beach club", "Jet ski adventure"]}, {"day": 3, "title": "Island Exploration", "activities": ["Island hopping tour", "Local market visit", "Traditional dinner"]}]',
'{"nature", "adventure", "beach"}'),

('Tokyo Neon Nights', 'Experience the electric energy of Tokyo''s nightlife and modern culture', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', '$$', '5 days', 5, 1899.00, 'Tokyo, Japan',
'[{"name": "Shibuya Night Tour", "duration": "4 hours", "price": 75}, {"name": "Karaoke Experience", "duration": "2 hours", "price": 45}, {"name": "Robot Restaurant Show", "duration": "2 hours", "price": 80}]',
'[{"day": 1, "title": "Arrival & Shibuya", "activities": ["Hotel check-in", "Shibuya crossing", "Dinner in Harajuku"]}, {"day": 2, "title": "Modern Tokyo", "activities": ["TeamLab Borderless", "Akihabara electronics", "Karaoke night"]}, {"day": 3, "title": "Traditional Meets Modern", "activities": ["Senso-ji Temple", "Tokyo Skytree", "Robot Restaurant"]}]',
'{"nightlife", "culture", "city"}'),

('Tuscan Wine & Dine', 'Indulge in the rolling hills, vineyards, and culinary delights of Tuscany', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80', '$$$', '6 days', 6, 3200.00, 'Tuscany, Italy',
'[{"name": "Wine Tasting Tour", "duration": "Half day", "price": 120}, {"name": "Cooking Class", "duration": "4 hours", "price": 150}, {"name": "Truffle Hunting", "duration": "3 hours", "price": 180}]',
'[{"day": 1, "title": "Florence Arrival", "activities": ["Hotel check-in", "Duomo visit", "Welcome dinner"]}, {"day": 2, "title": "Chianti Wine Region", "activities": ["Vineyard tour", "Wine tasting", "Countryside lunch"]}, {"day": 3, "title": "Culinary Experience", "activities": ["Cooking class", "Market visit", "Dinner at villa"]}]',
'{"culture", "food", "wine"}'),

('Patagonia Wilderness', 'Trek through breathtaking glaciers and pristine wilderness in South America', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', '$$', '10 days', 10, 2800.00, 'Patagonia, Argentina',
'[{"name": "Glacier Hiking", "duration": "Full day", "price": 200}, {"name": "Kayaking Adventure", "duration": "Half day", "price": 120}, {"name": "Wildlife Safari", "duration": "Full day", "price": 180}]',
'[{"day": 1, "title": "El Calafate Arrival", "activities": ["Airport transfer", "Town exploration", "Welcome briefing"]}, {"day": 2, "title": "Perito Moreno Glacier", "activities": ["Glacier trekking", "Ice hiking", "Photography session"]}, {"day": 3, "title": "Los Glaciares National Park", "activities": ["Hiking trails", "Wildlife spotting", "Camp dinner"]}]',
'{"nature", "adventure", "hiking"}'),

('Marrakech Magic', 'Immerse yourself in the vibrant souks, palaces, and culture of Morocco', 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80', '$', '4 days', 4, 899.00, 'Marrakech, Morocco',
'[{"name": "Souk Shopping Tour", "duration": "3 hours", "price": 40}, {"name": "Hammam Spa Experience", "duration": "2 hours", "price": 60}, {"name": "Desert Sunset Camel Ride", "duration": "4 hours", "price": 80}]',
'[{"day": 1, "title": "Medina Discovery", "activities": ["Riad check-in", "Jemaa el-Fnaa square", "Street food dinner"]}, {"day": 2, "title": "Palaces & Gardens", "activities": ["Bahia Palace", "Majorelle Garden", "Souk shopping"]}, {"day": 3, "title": "Desert Adventure", "activities": ["Camel ride", "Desert sunset", "Berber dinner"]}]',
'{"culture", "history", "adventure"}'),

('Bali Spiritual Retreat', 'Find peace and rejuvenation in Bali''s temples, rice terraces, and beaches', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', '$$', '8 days', 8, 1650.00, 'Bali, Indonesia',
'[{"name": "Yoga & Meditation", "duration": "2 hours", "price": 35}, {"name": "Temple Tour", "duration": "Half day", "price": 60}, {"name": "Rice Terrace Trek", "duration": "4 hours", "price": 50}]',
'[{"day": 1, "title": "Ubud Arrival", "activities": ["Villa check-in", "Welcome massage", "Organic dinner"]}, {"day": 2, "title": "Spiritual Journey", "activities": ["Morning yoga", "Temple visit", "Meditation session"]}, {"day": 3, "title": "Nature & Culture", "activities": ["Rice terrace walk", "Traditional dance", "Cooking class"]}]',
'{"nature", "culture", "wellness"}');
