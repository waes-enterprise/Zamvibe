import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding ZamVibe database...');

  // Clear existing data
  await db.post.deleteMany();
  await db.trendingTopic.deleteMany();
  await db.videoClip.deleteMany();

  // ==================== POSTS ====================
  const posts = [
    // BREAKING NEWS (5)
    {
      headline: "BREAKING: Chef 187 Announces Surprise Album Drop — 'The People's Champion' Out Now!",
      body: "In a shocking move that has sent Zambian social media into a frenzy, Chef 187 has just dropped a surprise album titled 'The People's Champion' at midnight. The album features 18 tracks with collaborations from Mampi, Yo Maps, and international artists. Fans have already flooded Twitter X with reactions, calling it his best work yet. The album is available on all streaming platforms and physical copies will hit Lusaka stores by Friday.",
      category: "Music",
      imageUrl: "/zamvibe/featured-1.png",
      isBreaking: true,
      isFeatured: true,
      views: 45230,
      shares: 3120,
      clicks: 8940,
    },
    {
      headline: "JK Concert Chaos: Fans Storm Stage After Power Cut in Kitwe",
      body: "JK's highly anticipated Copperbelt tour stop in Kitwe turned chaotic when a power cut hit the venue mid-performance. Angry fans reportedly stormed the stage, demanding refunds. The event organizers have issued a statement blaming Copperbelt Energy Corporation for the outage. JK himself took to Instagram to apologize, promising a free makeup concert. Police were called to restore order at the showgrounds.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
      isBreaking: true,
      isFeatured: false,
      views: 38910,
      shares: 2870,
      clicks: 7230,
    },
    {
      headline: "Mampi Engaged? Ring Spotted at Lusaka Fashion Week After-Party",
      body: "Social media is buzzing after photos surfaced of Zambian songstress Mampi sporting what appears to be an engagement ring at the Lusaka Fashion Week after-party at Radisson Blu. Sources close to the singer confirm she has been dating a South African businessman for the past eight months. The mysterious suitor was not at the event, but Mampi's team has neither confirmed nor denied the engagement rumors.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
      isBreaking: true,
      isFeatured: false,
      views: 52100,
      shares: 4560,
      clicks: 11200,
    },
    {
      headline: "Viral Video: Lusaka Street Food Vendor Goes TikTok Famous Overnight",
      body: "A street food vendor in Kamwala, Lusaka has become an overnight TikTok sensation after a video of his incredible nshima and chicken cooking skills went viral. The video, posted by @LusakaEats, has accumulated over 2.3 million views in just 48 hours. The vendor, known only as 'Uncle Bwalya', has been featured on BBC Africa and CNN. Zambians are now flocking to Kamwala market to taste his legendary cooking.",
      category: "Viral",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop",
      isBreaking: true,
      isFeatured: false,
      views: 67800,
      shares: 8900,
      clicks: 15600,
    },
    {
      headline: "EXCLUSIVE: Yo Maps Signs Major Record Deal with Universal Music Africa",
      body: "In what is being called the biggest deal in Zambian music history, Yo Maps has signed a multi-year recording and distribution deal with Universal Music Group Africa. The deal is reportedly worth over K5 million and includes international distribution, world tour support, and a dedicated production team. Yo Maps broke the news on his Instagram with a video captioned 'Zambia to the World!'. Industry insiders say this could open doors for more Zambian artists.",
      category: "Music",
      imageUrl: "/zamvibe/featured-2.png",
      isBreaking: true,
      isFeatured: true,
      views: 71200,
      shares: 6340,
      clicks: 14500,
    },

    // FEATURED (3 - 2 already breaking)
    {
      headline: "T Sean Opens Luxury Recording Studio in Lusaka's East Park Mall",
      body: "Zambian music producer T Sean has officially opened his state-of-the-art recording studio at East Park Mall in Lusaka. The studio, named 'The Lab ZM', features world-class equipment including a Neve mixing console worth over K2 million. T Sean says the studio will be available for both established and upcoming artists at affordable rates. The grand opening was attended by who's who of Zambian entertainment including Cleo Ice Queen and Slapdee.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: true,
      views: 29400,
      shares: 1890,
      clicks: 5200,
    },

    // MUSIC POSTS
    {
      headline: "Slapdee vs Chef 187: The Greatest Zambian Rap Beef Explained",
      body: "The long-standing rivalry between Slapdee and Chef 187 has been the defining narrative of Zambian hip-hop for over a decade. From subliminal disses to open confrontations, we break down every chapter of this legendary beef. Both artists have consistently denied any personal animosity, but fans know better. Recent social media posts have reignited speculation that new diss tracks are in the works. Who do you think is the true king of Zambian rap?",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 33100,
      shares: 2670,
      clicks: 7800,
    },
    {
      headline: "Cleo Ice Queen Drops New Single 'Fire Queen' — Fans Call It Her Best Yet",
      body: "Cleo Ice Queen has released her highly anticipated single 'Fire Queen' and the response has been overwhelmingly positive. The track, produced by Mzenga Man, showcases Cleo's growth as an artist with hard-hitting bars over an Afrobeat-infused instrumental. The music video, shot in Livingstone near Victoria Falls, has already amassed 500K views on YouTube in just one week. Cleo says the single is the lead track from her upcoming EP dropping next month.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 18700,
      shares: 1240,
      clicks: 3900,
    },
    {
      headline: "Zed Music Awards 2025 Nominees Announced — Full List Inside",
      body: "The nominees for the 2025 Zed Music Awards have been officially announced at a star-studded event in Lusaka. Leading the pack with 7 nominations is Chef 187, followed by Yo Maps with 6 and Mampi with 5. New categories this year include 'Best TikTok Song' and 'Best Collaboration with International Artist'. The ceremony is set for December at the Mulungushi International Conference Centre. Tickets are already selling fast on www.zedmusicawards.com.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 22600,
      shares: 1560,
      clicks: 4100,
    },
    {
      headline: "Underground Zambian Artists You Need to Hear Right Now",
      body: "While the big names dominate the airwaves, Zambian underground music is thriving. We've compiled a list of 10 underground artists who are making waves in the local scene. From Ndola's drill scene to Livingstone's reggae-dub movement, these artists represent the future of Zambian music. Artists include: Trap Boy C, Queen D, Jay Zed, MC Kalu, and more. Each one brings a unique sound that deserves your attention.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 12800,
      shares: 890,
      clicks: 2700,
    },

    // GOSSIP POSTS
    {
      headline: "Zambian Influencer Caught in Luxury Shopping Spree Scandal in Dubai",
      body: "Popular Zambian social media influencer, who goes by the handle @LusakaBaddie, has found herself at the center of a major scandal after photos emerged of her on a massive shopping spree in Dubai. The controversy? She had just weeks before posted a tearful video claiming she was 'broke and struggling'. Followers have accused her of misleading them for engagement. Several brands have reportedly dropped their partnerships with her.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 41500,
      shares: 3890,
      clicks: 9200,
    },
    {
      headline: "Celebrity Couple Split: Chanda Na Waya Break Up After 3 Years",
      body: "One of Zambia's most beloved celebrity couples, Chanda and Waya, have confirmed their separation after three years together. The couple, who met on the set of a TV commercial in 2022, released a joint statement asking for privacy during this 'difficult time'. Sources close to the couple cite 'irreconcilable differences' and demanding work schedules as the main reasons. Fans have taken to social media to express their heartbreak, with #ChandaWaya trending at number one on Zambian Twitter.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 36700,
      shares: 3200,
      clicks: 8100,
    },
    {
      headline: "Social Media Drama: Salma Dodges Questions About New Boyfriend",
      body: "Zambian media personality Salma has been playing hide and seek with fans about her rumored new boyfriend. During a live Instagram session, a fan asked point-blank about the man she was spotted with at Arcades Shopping Mall last weekend. Salma quickly changed the subject, further fueling the rumors. The mysterious man, seen wearing a designer suit and driving a Mercedes G-Wagon, is believed to be a Congolese businessman based in Lusaka.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 25800,
      shares: 2100,
      clicks: 5900,
    },
    {
      headline: "Ex-Big Brother Zed Housemate Opens Up About Life After the Show",
      body: "Former Big Brother Zambia housemate Mulenga Mwanza has opened up about the challenges of life after reality TV fame. In an exclusive interview with ZamVibe, Mulenga revealed that she struggled with depression after the show ended and the spotlight faded. 'People think being famous is easy, but when the cameras stop rolling, reality hits hard,' she said. Mulenga is now using her platform to advocate for mental health awareness in Zambia.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 19400,
      shares: 1670,
      clicks: 4300,
    },
    {
      headline: "Zambian Footballer's Wife Flaunts K3 Million Birthday Gift on Instagram",
      body: "The wife of a Zambian international footballer has caused a stir on social media after showing off her birthday gift — a brand new Porsche Cayenne reportedly worth K3 million. The lavish gift has sparked debate about the wealth of Zambian footballers and their families. While some fans congratulated her, others questioned whether such displays of wealth are appropriate in a country where many struggle with poverty. The footballer, who plays for a club in South Africa, has not commented.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 31200,
      shares: 2870,
      clicks: 6800,
    },

    // VIRAL POSTS
    {
      headline: "Zambian Grandmother Becomes TikTok Star With Traditional Dance Videos",
      body: "A 72-year-old grandmother from Chipata has become TikTok's latest viral sensation with her traditional dance videos. Granny Bessie, as she's known online, has accumulated over 1.5 million followers in just two months with her energetic performances of traditional Zambian dances including kalindula, chinkonono, and muchongoyo. Major brands including MTN Zambia and Dangote Cement have already reached out for partnerships. Granny Bessie says she's just having fun and wants to preserve Zambian culture.",
      category: "Viral",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 89300,
      shares: 12400,
      clicks: 21000,
    },
    {
      headline: "Ndola Man Builds Working Car From Scrap Metal — Video Goes Viral",
      body: "A self-taught mechanic from Ndola's industrial area has stunned the internet by building a fully functional car from scrap metal and salvaged parts. Chishimba Banda, 34, spent 18 months building the vehicle in his backyard workshop. The video, posted by his cousin, shows the car driving around Ndola streets smoothly. Engineering students from the Copperbelt University have visited Chishimba to study his creation. Several local companies have offered him sponsorship and workshop space.",
      category: "Viral",
      imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 56700,
      shares: 7890,
      clicks: 13400,
    },
    {
      headline: "The 'Nshima Challenge' Is Taking Over Zambian Social Media",
      body: "A new social media challenge is sweeping through Zambia — the #NshimaChallenge. Participants attempt to eat a mountain of nshima using only their hands in under 5 minutes. The challenge was started by University of Zambia students and has since been taken up by celebrities including Chef 187 and Pompi. Restaurants across Lusaka are now offering 'challenge platters' for customers who want to try it. Medical professionals have however warned about the dangers of overeating.",
      category: "Viral",
      imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 43800,
      shares: 5600,
      clicks: 10200,
    },
    {
      headline: "Lusaka Traffic Officer Caught Dancing on Duty — Gets Promoted Instead",
      body: "A Lusaka traffic officer who was filmed busting some impressive dance moves while directing traffic at the Kabwe Roundabout has gone viral — and instead of getting in trouble, he's been promoted. Inspector Mwamba Chisenga's dance video, posted by a motorist, received 3 million views. The Lusaka City Council praised his 'community engagement' and promoted him to Senior Inspector. Mwamba says dancing helps him stay positive despite the stressful job.",
      category: "Viral",
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 62100,
      shares: 9100,
      clicks: 15800,
    },

    // LIFESTYLE POSTS
    {
      headline: "Top 10 Hidden Food Spots in Lusaka Only Locals Know About",
      body: "Forget the usual tourist restaurants — we've compiled the ultimate list of hidden food gems in Lusaka that only locals know about. From Mama Joyce's legendary ifisashi in Matero to the secret braai spot behind Levy Mall, these places serve the most authentic Zambian food you'll find anywhere. We also uncovered a tiny café in Kabulonga making the best Zambian coffee you've ever tasted. Each spot was visited and reviewed by our food team over the past month.",
      category: "Lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 15600,
      shares: 1230,
      clicks: 3800,
    },
    {
      headline: "Lusaka Nightlife Guide 2025: The Best Clubs, Bars, and Hangouts",
      body: "Lusaka's nightlife scene is booming like never before. From the upscale Eclipse Lounge in Rhodespark to the legendary Club Zed along Cairo Road, there's something for everyone. New entries this year include The Rooftop at Latitude 15 and Neon Nights in Manda Hill. We've rated each venue on music quality, crowd vibe, drink prices, and safety. Plus, we reveal the celebrity hotspots where you might bump into your favorite Zambian stars.",
      category: "Lifestyle",
      imageUrl: "/zamvibe/featured-3.png",
      isBreaking: false,
      isFeatured: false,
      views: 21300,
      shares: 1780,
      clicks: 4600,
    },
    {
      headline: "Fitness Trend: Zambian Women Embracing Strength Training Like Never Before",
      body: "Gyms across Zambia's major cities are reporting a surge in female memberships, with more Zambian women embracing strength training and weightlifting. The trend, fueled by social media fitness influencers and a growing awareness of women's health, has seen gyms in Lusaka, Kitwe, and Ndola introduce dedicated women's weight rooms. Leading the movement are Zambian fitness queens like @FitZedQueen and @MuscleMamaZM who have inspired thousands of women to pick up dumbbells.",
      category: "Lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 14200,
      shares: 980,
      clicks: 3100,
    },
    {
      headline: "Livingstone Adventure Tourism Boom: Victoria Falls Sees Record Visitors",
      body: "Victoria Falls is experiencing its highest visitor numbers in a decade, with adventure tourism leading the charge. Activities like bungee jumping, white water rafting, and the new zip-line across the gorge are drawing tourists from around the world. Local businesses are thriving, with new hotels and restaurants opening to cater to the influx. The Zambian government has announced plans to upgrade the Livingstone Airport to handle increased international flights. Tourism Minister said adventure tourism revenue is up 45% from last year.",
      category: "Lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1609947017136-9daf32e2c55b?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 18900,
      shares: 1450,
      clicks: 3700,
    },
    {
      headline: "Zambian Fashion Designers Making Waves at Africa Fashion Week",
      body: "Three Zambian fashion designers have been selected to showcase their collections at this year's Africa Fashion Week in Johannesburg. The designers — Banda Creative, House of Mwamba, and ZedThread — will represent Zambia's growing fashion industry on the continental stage. Their collections feature traditional Zambian textiles like chitenge and malachite patterns reimagined for modern haute couture. This is the largest Zambian representation at the event in its history.",
      category: "Lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 11700,
      shares: 760,
      clicks: 2400,
    },

    // EXTRA POSTS TO REACH 25+
    {
      headline: "Zambian Comedian 'Uncle K' Lands Netflix Comedy Special Deal",
      body: "Zambian stand-up comedian Uncle K has signed a deal with Netflix for his first-ever comedy special. The special, titled 'From Lusaka to the World', was filmed during his sold-out show at the Sandton Convention Centre in Johannesburg. Uncle K is known for his sharp observational comedy about Zambian life, from the chaos of minibuses to the politics of funerals. The special is expected to premiere in early 2026 and will make him the first Zambian comedian on the platform.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 26800,
      shares: 2340,
      clicks: 6100,
    },
    {
      headline: "TikTok Drama: Zambian Creator Exposed for Fake Lifestyle Content",
      body: "A popular Zambian TikTok creator with over 800K followers has been exposed for faking her luxury lifestyle content. An investigation by online sleuths revealed that the mansions, luxury cars, and designer outfits featured in her videos were all rented for content creation purposes. The creator, who portrayed herself as a successful businesswoman, has lost over 100K followers in the past 24 hours. This incident has sparked a wider conversation about authenticity on Zambian social media.",
      category: "Gossip",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
      isBreaking: false,
      isFeatured: false,
      views: 35600,
      shares: 4100,
      clicks: 8900,
    },
  ];

  // Spread posts with slightly different timestamps
  const now = new Date();
  for (let i = 0; i < posts.length; i++) {
    const hoursAgo = i * 3 + Math.floor(Math.random() * 5);
    const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    await db.post.create({
      data: {
        ...posts[i],
        createdAt,
        updatedAt: createdAt,
      },
    });
  }
  console.log(`✅ Created ${posts.length} posts`);

  // ==================== TRENDING TOPICS ====================
  const trendingTopics = [
    { title: "Chef 187 Surprise Album", rank: 1, posts: 2340, category: "Music" },
    { title: "Mampi Engagement Ring", rank: 2, posts: 1890, category: "Gossip" },
    { title: "Granny Bessie TikTok", rank: 3, posts: 1560, category: "Viral" },
    { title: "Yo Maps Universal Deal", rank: 4, posts: 1230, category: "Music" },
    { title: "JK Concert Chaos Kitwe", rank: 5, posts: 980, category: "Music" },
    { title: "Nshima Challenge", rank: 6, posts: 870, category: "Viral" },
    { title: "Lusaka Nightlife 2025", rank: 7, posts: 650, category: "Lifestyle" },
    { title: "Zed Fashion Week", rank: 8, posts: 540, category: "Lifestyle" },
    { title: "Chanda Na Waya Split", rank: 9, posts: 430, category: "Gossip" },
    { title: "Victoria Falls Tourism", rank: 10, posts: 380, category: "Lifestyle" },
  ];

  for (const topic of trendingTopics) {
    await db.trendingTopic.create({ data: topic });
  }
  console.log(`✅ Created ${trendingTopics.length} trending topics`);

  // ==================== VIDEO CLIPS ====================
  const videoClips = [
    {
      headline: "Chef 187 Performs 'Number 1 Fan' Live — Crowd Goes Wild!",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "/zamvibe/featured-1.png",
      views: 125000,
      category: "Music",
    },
    {
      headline: "Granny Bessie Teaches Traditional Dance — Must Watch!",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop",
      views: 89000,
      category: "Viral",
    },
    {
      headline: "Lusaka Fashion Week Highlights — Best Looks on the Runway",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "/zamvibe/featured-2.png",
      views: 67000,
      category: "Lifestyle",
    },
    {
      headline: "Yo Maps 'So Mone' Official Music Video Behind the Scenes",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=700&fit=crop",
      views: 145000,
      category: "Music",
    },
    {
      headline: "Zambian Street Food Tour in Kamwala Market",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=700&fit=crop",
      views: 92000,
      category: "Lifestyle",
    },
    {
      headline: "Ndola Man's Scrap Metal Car — Full Build Time-lapse",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=700&fit=crop",
      views: 210000,
      category: "Viral",
    },
    {
      headline: "T Sean Studio Tour — Inside 'The Lab ZM'",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=700&fit=crop",
      views: 54000,
      category: "Music",
    },
    {
      headline: "Bungee Jumping at Victoria Falls — POV Experience",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1609947017136-9daf32e2c55b?w=400&h=700&fit=crop",
      views: 178000,
      category: "Lifestyle",
    },
  ];

  for (const clip of videoClips) {
    await db.videoClip.create({ data: clip });
  }
  console.log(`✅ Created ${videoClips.length} video clips`);

  console.log('🎉 ZamVibe database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
