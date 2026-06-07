import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Headphones,
  Instagram,
  MapPin,
  Menu,
  Mic2,
  Music2,
  Play,
  Radio,
  Search,
  Sparkles,
  Users,
  Video,
  Youtube
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PageId = "home" | "bio" | "music" | "videos" | "shows" | "press" | "label" | "sitemap";

gsap.registerPlugin(ScrollTrigger);

type NavItem = {
  id: PageId;
  label: string;
};

type Source = {
  label: string;
  url: string;
};

type Release = {
  title: string;
  type: string;
  year: string;
  image: string;
  note: string;
  url: string;
  tracks?: string[];
  credits?: string;
};

type PressItem = {
  title: string;
  outlet: string;
  year: string;
  summary: string;
  image: string;
  url: string;
};

type VideoItem = {
  title: string;
  context: string;
  embed: string;
  url: string;
};

type ShowItem = {
  title: string;
  venue: string;
  status: string;
  detail: string;
  url: string;
  date?: string;
  time?: string;
  image?: string;
};

type PlatformLink = {
  label: string;
  detail: string;
  url: string;
};

const navItems: NavItem[] = [
  { id: "home", label: "Latest" },
  { id: "music", label: "Music" },
  { id: "videos", label: "Projects" },
  { id: "shows", label: "Live" },
  { id: "press", label: "Press" },
  { id: "label", label: "88OE" },
  { id: "bio", label: "Bio" },
  { id: "sitemap", label: "Sitemap" }
];

const sources: Source[] = [
  {
    label: "Lookout Santa Cruz, NEXTies 2024 Musician of the Year",
    url: "https://lookout.co/nexties-2024-musician-of-the-year-alwa-gordon-spotlight/story"
  },
  {
    label: "Good Times, Love Your Local Band",
    url: "https://www.goodtimes.sc/love-local-band-alwa-gordon/"
  },
  {
    label: "Good Times, Loving Yourself profile",
    url: "https://www.goodtimes.sc/rapper-alwa-gordon-breakthrough-new-song-loving-yourself/"
  },
  {
    label: "Alwa Gordon on Bandcamp",
    url: "https://alwagordon.bandcamp.com/music"
  },
  {
    label: "Event Santa Cruz, LEAVE release post",
    url: "https://www.eventsantacruz.com/alwa-gordon-new-song-alert-leave-slowed-and-reverbed/"
  },
  {
    label: "Moe's Alley artist and event pages",
    url: "https://moesalley.com/tm-attraction/alwa-gordon/"
  },
  {
    label: "Apple Music, TEXT ME IF YOU CAN",
    url: "https://music.apple.com/us/album/text-me-if-you-can/1824897413"
  }
];

const releases: Release[] = [
  {
    title: "TEXT ME IF YOU CAN",
    type: "Album",
    year: "Bandcamp release",
    image: "/alwa/text-me-if-you-can.jpg",
    note: "2025 project released through 88 Over Everything.",
    url: "https://alwagordon.bandcamp.com/album/text-me-if-you-can",
    tracks: ["WIN", "PILOT", "BODY", "GHOST LIKE CASPER", "RAIN", "SECRETS", "T PAYNE"],
    credits: "Apple Music lists the album at 7 songs, 23 minutes, released July 10, 2025 through 88 Over Everything."
  },
  {
    title: "10 SECONDS LEFT",
    type: "Album",
    year: "Bandcamp release",
    image: "/alwa/10-seconds-left.jpg",
    note: "Collaborative album with Alexandra The Author.",
    url: "https://alwagordon.bandcamp.com/album/10-seconds-left",
    tracks: ["OUTSIDE", "NOT AROUND", "SIDEWAYS", "I'LL BE WAITING", "CRAWLING", "I CAN'T", "DON'T GIVE UP ON ME", "HOME"],
    credits: "Presented by Soul Good Ent and 88 Over Everything; made possible with grants by Santa Cruz Arts Council."
  },
  {
    title: "DETAILS",
    type: "Track",
    year: "Bandcamp release",
    image: "/alwa/details.jpg",
    note: "Single-track release from the Bandcamp catalog.",
    url: "https://alwagordon.bandcamp.com/track/details"
  },
  {
    title: "Thanks For Waiting",
    type: "Album",
    year: "Bandcamp release",
    image: "/alwa/thanks-for-waiting.jpg",
    note: "Project that led into the 2023 LEAVE release moment.",
    url: "https://alwagordon.bandcamp.com/album/thanks-for-waiting"
  }
];

const pressItems: PressItem[] = [
  {
    title: "NEXTies 2024 Musician of the Year: Alwa Gordon Spotlight",
    outlet: "Lookout Santa Cruz",
    year: "2024",
    summary:
      "A long-form Santa Cruz spotlight recognizing Alwa Gordon as the NEXTies 2024 Musician of the Year and covering 88 Over Everything.",
    image: "/alwa/alwa-nexties-lookout.jpg",
    url: "https://lookout.co/nexties-2024-musician-of-the-year-alwa-gordon-spotlight/story"
  },
  {
    title: "Love Your Local Band: Alwa Gordon",
    outlet: "Good Times",
    year: "2019",
    summary:
      "Good Times introduced Alwa as a Santa Cruz hip hop voice and local scene builder.",
    image: "/alwa/alwa-goodtimes-2019.jpg",
    url: "https://www.goodtimes.sc/love-local-band-alwa-gordon/"
  },
  {
    title: "Rapper Alwa Gordon Has Breakthrough on New Song Loving Yourself",
    outlet: "Good Times",
    year: "2020",
    summary:
      "A profile around the song Loving Yourself and the emotional clarity in Alwa's work.",
    image: "/alwa/alwa-goodtimes-loving-yourself.jpg",
    url: "https://www.goodtimes.sc/rapper-alwa-gordon-breakthrough-new-song-loving-yourself/"
  }
];

const videos: VideoItem[] = [
  {
    title: "LEAVE - slowed and reverbed",
    context: "Embedded from Event Santa Cruz's release post.",
    embed: "https://www.youtube.com/embed/DR2rIs6E4t0",
    url: "https://youtu.be/DR2rIs6E4t0"
  }
];

const showItems: ShowItem[] = [
  {
    title: "Saritah with Alwa Gordon and DJ Ay Que Linda",
    venue: "Moe's Alley, Santa Cruz",
    status: "Past show",
    date: "June 5, 2025",
    time: "Doors 7 PM / Show 8 PM",
    image: "/alwa/moes-saritah-alwa-event.jpg",
    detail:
      "Moe's Alley billed Alwa as a Santa Cruz-based hip-hop artist, producer, and founder of 88 Over Everything.",
    url: "https://moesalley.com/?p=4253"
  },
  {
    title: "NEXTies recognition cycle",
    venue: "Santa Cruz County",
    status: "2024 milestone",
    detail:
      "The Lookout Santa Cruz spotlight ties Alwa's work to the NEXTies 2024 Musician of the Year recognition.",
    url: "https://lookout.co/nexties-2024-musician-of-the-year-alwa-gordon-spotlight/story"
  },
  {
    title: "Release media appearances",
    venue: "Event Santa Cruz and Good Times",
    status: "Press archive",
    detail:
      "Release moments and profiles that connect the records to the city.",
    url: "https://www.eventsantacruz.com/alwa-gordon-new-song-alert-leave-slowed-and-reverbed/"
  }
];

const platformLinks: PlatformLink[] = [
  {
    label: "Bandcamp",
    detail: "Projects, credits, cover art, direct support.",
    url: "https://alwagordon.bandcamp.com/music"
  },
  {
    label: "Apple Music",
    detail: "TEXT ME IF YOU CAN and streaming catalog.",
    url: "https://music.apple.com/us/album/text-me-if-you-can/1824897413"
  },
  {
    label: "Spotify",
    detail: "Lookout confirms the music is on Spotify under the same name.",
    url: "https://open.spotify.com/search/Alwa%20Gordon"
  },
  {
    label: "YouTube",
    detail: "Videos and lyric drops under Alwa Gordon.",
    url: "https://www.youtube.com/results?search_query=Alwa+Gordon"
  },
  {
    label: "Instagram",
    detail: "Lookout lists @alwagordon as the best update channel.",
    url: "https://www.instagram.com/alwagordon/"
  },
  {
    label: "Booking",
    detail: "Business and booking email from Lookout profile.",
    url: "mailto:88overeverything@gmail.com"
  }
];

const brandImages = {
  hero: "/alwa/alwagordon-hero-canva-2x.jpg",
  heroSquare: "/alwa/alwagordon-hero.jpg",
  logo: "/alwa/alwagordon-logo.jpg",
  portrait: "/alwa/alwagordon-portrait-rail.jpg",
  overhead: "/alwa/alwagordon-overhead.jpg",
  sideProfile: "/alwa/alwagordon-side-profile.jpg"
};

const stats = [
  { value: "2024", label: "NEXTies Musician of the Year" },
  { value: "88OE", label: "Label and community banner" },
  { value: "4", label: "Bandcamp-listed releases" },
  { value: "SC", label: "Santa Cruz rooted" }
];

const siteMap = [
  { title: "Home", target: "Landing, featured media, quick links" },
  { title: "Bio", target: "Story, city, movement, 88OE" },
  { title: "Music", target: "Projects, singles, listening links" },
  { title: "Videos", target: "Visuals, drops, live moments" },
  { title: "Shows", target: "Live history and booking lane" },
  { title: "Press", target: "Articles, photos, pull quotes" },
  { title: "88 Over Everything", target: "Label identity, collaborators, community lane" },
  { title: "Sitemap", target: "Whole site at a glance" }
];

const pageTitles: Record<PageId, string> = {
  home: "Alwa Gordon",
  bio: "Bio",
  music: "Music",
  videos: "Videos",
  shows: "Shows",
  press: "Press",
  label: "88 Over Everything",
  sitemap: "Sitemap"
};

const pagePaths: Record<PageId, string> = {
  home: "/",
  bio: "/bio",
  music: "/music",
  videos: "/videos",
  shows: "/shows",
  press: "/press",
  label: "/88-over-everything",
  sitemap: "/sitemap"
};

const pathPages = Object.fromEntries(Object.entries(pagePaths).map(([key, value]) => [value, key])) as Record<string, PageId>;
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const pageUrl = (page: PageId) => `${basePath}${pagePaths[page] === "/" ? "/" : pagePaths[page]}`;
const clearScrollExperience = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
  gsap.globalTimeline.clear();
};
const currentPageFromLocation = () => {
  const basePrefix = basePath && basePath !== "." ? basePath : "";
  const strippedPath = basePrefix && window.location.pathname.startsWith(basePrefix)
    ? window.location.pathname.slice(basePrefix.length) || "/"
    : window.location.pathname;
  return pathPages[strippedPath] || "home";
};

function App() {
  const [activePage, setActivePage] = useState<PageId>(() => currentPageFromLocation());
  const page = useMemo(() => pageTitles[activePage], [activePage]);
  const appRootRef = useRef<HTMLDivElement>(null);
  const navigate = (nextPage: PageId) => {
    clearScrollExperience();
    window.scrollTo({ top: 0, behavior: "instant" });
    setActivePage(nextPage);
    window.history.pushState({}, "", pageUrl(nextPage));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };

  useEffect(() => {
    const onPopState = () => {
      clearScrollExperience();
      setActivePage(currentPageFromLocation());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useScrollExperience(appRootRef, activePage);

  return (
    <TooltipProvider>
      <div ref={appRootRef} className="min-h-screen bg-[#080808] text-stone-100">
        <div className="site-noise" />
        <Header activePage={activePage} onNavigate={navigate} />
        <main>
          {activePage === "home" && <HomePage onNavigate={navigate} />}
          {activePage === "bio" && <BioPage />}
          {activePage === "music" && <MusicPage />}
          {activePage === "videos" && <VideosPage />}
          {activePage === "shows" && <ShowsPage />}
          {activePage === "press" && <PressPage />}
          {activePage === "label" && <LabelPage />}
          {activePage === "sitemap" && <SitemapPage />}
        </main>
        <Footer currentPage={page} onNavigate={navigate} />
      </div>
    </TooltipProvider>
  );
}

function useScrollExperience(rootRef: React.RefObject<HTMLDivElement | null>, activePage: PageId) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const mm = gsap.matchMedia();
    const context = gsap.context(() => {

      mm.add("(min-width: 761px)", () => {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".brand-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.22,
            anticipatePin: 1
          }
        });

        heroTimeline
          .to(".brand-hero-image", { scale: 1.025, filter: "saturate(1.12) contrast(1.04)", ease: "none" }, 0)
          .to(".brand-hero-actions", { y: -22, opacity: 0, ease: "none" }, 0)
          .fromTo(".artist-atmosphere", { opacity: 0 }, { opacity: 0.75, ease: "none" }, 0.12);
      });

      mm.add("(max-width: 760px)", () => {
        gsap.to(".brand-hero-image", {
          scale: 1.025,
          yPercent: -2,
          ease: "none",
          scrollTrigger: {
            trigger: ".brand-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.2
          }
        });
      });

      gsap.utils.toArray<HTMLElement>(".feature-band").forEach((section, index) => {
        const copy = section.querySelector(".feature-copy");
        const media = section.querySelector("img, .wide-video");

        gsap.fromTo(
          copy,
          { autoAlpha: 0, x: index % 2 === 0 ? -72 : 72 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "top 42%",
              scrub: 0.22
            }
          }
        );

        gsap.fromTo(
          media,
          { autoAlpha: 0.72, scale: 1.04, xPercent: index % 2 === 0 ? 3 : -3 },
          {
            autoAlpha: 1,
            scale: 1,
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.24
            }
          }
        );
      });

      gsap.fromTo(
        ".release-marquee-lead",
        { clipPath: "inset(0 50% 0 50%)", autoAlpha: 0.55 },
        {
          clipPath: "inset(0 0% 0 0%)",
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".release-marquee-lead",
            start: "top 94%",
            end: "top 38%",
            scrub: 0.12
          }
        }
      );

      gsap.utils.toArray<HTMLElement>(".release-marquee-lead .release-cover").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            xPercent: index < 2 ? -22 : 22,
            yPercent: index % 2 === 0 ? 10 : -10,
            rotate: index < 2 ? -3 : 3,
            scale: 0.94
          },
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".release-marquee-lead",
              start: "top 92%",
              end: "center 44%",
              scrub: 0.16
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".editorial-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            xPercent: index === 0 ? -18 : 18,
            scale: 0.96
          },
          {
            autoAlpha: 1,
            xPercent: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".editorial-grid",
              start: "top 88%",
              end: "center 42%",
              scrub: 0.18
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".page-shell, .timeline-list, .track-grid, [data-slot='card'], .platform-link").forEach(element => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28, scale: 0.995 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "top 66%",
              scrub: 0.18
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".page-shell [data-slot='card'], .page-shell .platform-link, .page-shell .timeline-row, .page-shell .track-row").forEach((item, index) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28, rotateX: 4 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse"
            },
            delay: Math.min((index % 6) * 0.035, 0.18)
          }
        );
      });

      ScrollTrigger.refresh();

    }, root);

    return () => {
      mm.revert();
      context.revert();
    };
  }, [rootRef, activePage]);
}

function Header({ activePage, onNavigate }: { activePage: PageId; onNavigate: (page: PageId) => void }) {
  const leftNav = navItems.filter(item => ["home", "music", "label", "videos", "shows"].includes(item.id));
  const rightNav = navItems.filter(item => ["press", "bio", "sitemap"].includes(item.id));

  return (
    <header className="site-header">
      <div className="site-header-grid">
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {leftNav.map(item => (
            <button
              key={item.id}
              className={`gaga-nav-word ${activePage === item.id ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="artist-logo" onClick={() => onNavigate("home")} type="button" aria-label="Alwa Gordon home">
          <img src={assetPath(brandImages.logo)} alt="Alwa Gordon Music" />
        </button>
        <nav className="hidden items-center justify-end gap-5 lg:flex" aria-label="Secondary navigation">
          {rightNav.map(item => (
            <button
              key={item.id}
              className={`gaga-nav-word ${activePage === item.id ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <Button asChild variant="outline" size="sm" className="header-action">
            <a href="https://alwagordon.bandcamp.com/music" target="_blank" rel="noreferrer">
              <Headphones data-icon="inline-start" />
              Listen
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm" className="header-action">
            <a href="https://www.youtube.com/results?search_query=Alwa+Gordon" target="_blank" rel="noreferrer">
              <Youtube data-icon="inline-start" />
              YouTube
            </a>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mobile-menu-button lg:hidden" variant="outline" size="icon">
              <Menu />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="mobile-drawer border-white/10 text-stone-100" side="right">
            <SheetTitle className="drawer-title">
              <span>Alwa Gordon</span>
              <small>88 Over Everything</small>
            </SheetTitle>
            <div className="drawer-nav-list">
              {navItems.map(item => (
                <SheetClose key={item.id} asChild>
                  <button className={`drawer-nav-link ${activePage === item.id ? "is-active" : ""}`} onClick={() => onNavigate(item.id)} type="button">
                    <span>{item.label}</span>
                    <ArrowUpRight />
                  </button>
                </SheetClose>
              ))}
            </div>
            <div className="drawer-actions">
              <Button asChild>
                <a href="https://alwagordon.bandcamp.com/music" target="_blank" rel="noreferrer">
                  <Headphones data-icon="inline-start" />
                  Listen
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://www.youtube.com/results?search_query=Alwa+Gordon" target="_blank" rel="noreferrer">
                  <Youtube data-icon="inline-start" />
                  YouTube
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <>
      <section className="brand-hero">
        <picture className="brand-hero-picture">
          <source media="(min-width: 761px)" srcSet={assetPath(brandImages.hero)} />
          <img className="brand-hero-image" src={assetPath(brandImages.heroSquare)} alt="Alwa Gordon Music hero graphic" />
        </picture>
        <div className="brand-hero-actions">
          <Button asChild size="lg">
            <a href="https://alwagordon.bandcamp.com/music" target="_blank" rel="noreferrer">
              <Headphones data-icon="inline-start" />
              Listen
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={() => onNavigate("videos")}>
            <Play data-icon="inline-start" />
            Watch
          </Button>
        </div>
      </section>
      <FeaturedGrid onNavigate={onNavigate} />
    </>
  );
}

function FeaturedGrid({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <section className="artist-home">
      <div className="artist-atmosphere" aria-hidden="true">
        <img className="atmosphere-shot atmosphere-shot-a" src={assetPath(brandImages.portrait)} alt="" />
        <img className="atmosphere-shot atmosphere-shot-b" src={assetPath(brandImages.overhead)} alt="" />
        <img className="atmosphere-shot atmosphere-shot-c" src={assetPath(brandImages.sideProfile)} alt="" />
      </div>

      <div className="release-marquee release-marquee-lead">
        {releases.map(release => (
          <a key={release.title} className="release-cover" href={release.url} target="_blank" rel="noreferrer">
            <img src={assetPath(release.image)} alt={`${release.title} cover art`} />
            <span>{release.title}</span>
          </a>
        ))}
      </div>

      <div className="feature-band feature-band-album">
        <div className="feature-copy">
          <p>New release</p>
          <h2>TEXT ME IF YOU CAN</h2>
          <span>Seven songs through 88 Over Everything. Direct from Santa Cruz into the rotation.</span>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://alwagordon.bandcamp.com/album/text-me-if-you-can" target="_blank" rel="noreferrer">
                Bandcamp <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://music.apple.com/us/album/text-me-if-you-can/1824897413" target="_blank" rel="noreferrer">
                Apple Music <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          </div>
        </div>
        <img src={assetPath("/alwa/text-me-if-you-can.jpg")} alt="TEXT ME IF YOU CAN cover art" />
      </div>

      <div className="feature-band feature-band-video">
        <a className="wide-video" href="https://youtu.be/DR2rIs6E4t0" target="_blank" rel="noreferrer">
          <img src={assetPath("/alwa/leave-video-thumb.jpg")} alt="LEAVE video thumbnail" />
          <span className="video-play">
            <Play />
          </span>
        </a>
        <div className="feature-copy">
          <p>Official visual</p>
          <h2>LEAVE</h2>
          <span>One strong video moment up front, with room for the channel to grow around official videos, lyric drops, and 88OE footage.</span>
          <Button className="mt-7" variant="outline" onClick={() => onNavigate("videos")}>
            More projects <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <div className="editorial-grid">
        <button className="editorial-card" onClick={() => onNavigate("shows")} type="button">
          <img src={assetPath("/alwa/moes-saritah-alwa-event.jpg")} alt="Moe's Alley event flyer" />
          <span>Live</span>
          <strong>Moe&apos;s Alley and the rooms where the records breathe.</strong>
        </button>
        <button className="editorial-card" onClick={() => onNavigate("press")} type="button">
          <img src={assetPath("/alwa/alwa-nexties-lookout.jpg")} alt="Alwa Gordon Lookout Santa Cruz portrait" />
          <span>Press</span>
          <strong>NEXTies Musician of the Year. Santa Cruz in the story.</strong>
        </button>
      </div>
    </section>
  );
}

function BioPage() {
  return (
    <PageShell eyebrow="Artist Biography" title="Santa Cruz raised the sound. Alwa carries it forward.">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-5">
          <img className="rounded-md border border-white/10 object-cover" src={assetPath(brandImages.portrait)} alt="Alwa Gordon seated portrait" />
          <SourceCard />
        </div>
        <div className="flex flex-col gap-6 text-lg leading-8 text-stone-300">
          <p>
            Alwa Gordon is a Santa Cruz, California hip hop artist, producer, and founder of the independent label 88 Over Everything. Moe&apos;s Alley traces the spark back to hearing Tupac&apos;s &quot;My Ambition as a Rider,&quot; a CD from his older brother that changed the whole direction.
          </p>
          <p>
            He started writing and recording at 16, moved through the rap group Can&apos;t Stop Us, then built solo momentum with The 11th Hour, 16 Summers, Thanks For Waiting, 10 SECONDS LEFT with Alexandra The Author, and TEXT ME IF YOU CAN.
          </p>
          <p>
            The story has industry receipts too: a 2012 mixtape put him around Poo Bear and The Audibles, while 88 Over Everything became the vehicle for local artists, shows, visuals, and overlooked Central Coast talent.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat icon={Mic2} value="Hip hop" label="Primary lane" />
            <MiniStat icon={MapPin} value="Santa Cruz" label="Home base" />
            <MiniStat icon={Radio} value="88OE" label="Creative banner" />
          </div>
          <div className="timeline-list">
            {[
              ["16", "Started writing and recording music."],
              ["2012", "The 11th Hour brought major-label attention and sessions with Poo Bear."],
              ["2016", "Established 88 Over Everything as his independent creative label."],
              ["2019", "Released 16 Summers and earned Good Times local-band coverage."],
              ["2024", "Named NEXTies Musician of the Year by Lookout Santa Cruz."],
              ["2025", "TEXT ME IF YOU CAN released through 88 Over Everything."]
            ].map(([year, text]) => (
              <div key={year} className="timeline-row">
                <span>{year}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function MusicPage() {
  return (
    <PageShell eyebrow="Discography" title="Run the records back. Start with the projects.">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {releases.map(release => (
          <Card key={release.title} className="group overflow-hidden border-white/10 bg-white/[0.035] text-stone-100">
            <a href={release.url} target="_blank" rel="noreferrer">
              <img className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" src={assetPath(release.image)} alt={`${release.title} cover art`} />
            </a>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{release.type}</Badge>
                <span className="text-xs text-stone-500">{release.year}</span>
              </div>
              <CardTitle>{release.title}</CardTitle>
              <CardDescription className="text-stone-400">{release.note}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        {releases.filter(release => release.tracks?.length).map(release => (
          <ReleaseDeepDive key={release.title} release={release} />
        ))}
      </div>
      <PlatformGrid />
      <Tabs defaultValue="bandcamp" className="w-full">
        <TabsList>
          <TabsTrigger value="bandcamp">Bandcamp</TabsTrigger>
          <TabsTrigger value="spotify">Spotify</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>
        <TabsContent value="bandcamp">
          <MediaPanel title="Bandcamp" copy="Projects, singles, cover art, and the most direct lane into the catalog." url="https://alwagordon.bandcamp.com/music" />
        </TabsContent>
        <TabsContent value="spotify">
          <MediaPanel title="Spotify" copy="Search the name, follow the records, and keep the rotation moving." url="https://open.spotify.com/search/Alwa%20Gordon" />
        </TabsContent>
        <TabsContent value="credits">
          <MediaPanel title="88OE credits" copy="A home for features, producers, video crews, art direction, and the people behind the movement." url="https://lookout.co/nexties-2024-musician-of-the-year-alwa-gordon-spotlight/story" />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function VideosPage() {
  return (
    <PageShell eyebrow="Video" title="Visuals for the records, the city, and the movement.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.45fr]">
        <div className="grid gap-5">
          {videos.map(video => (
            <Card key={video.embed} className="overflow-hidden border-white/10 bg-white/[0.035] text-stone-100">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={video.embed}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
                <CardDescription className="text-stone-400">{video.context}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card className="border-white/10 bg-red-500/10 text-stone-100">
          <CardHeader>
            <CardTitle>Video channel lane</CardTitle>
            <CardDescription className="text-stone-300">
              Built for official videos, lyric drops, live sessions, shorts, and behind-the-scenes 88OE cuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <a href="https://www.youtube.com/results?search_query=Alwa+Gordon" target="_blank" rel="noreferrer">
                <Youtube data-icon="inline-start" />
                Search YouTube
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://www.eventsantacruz.com/alwa-gordon-new-song-alert-leave-slowed-and-reverbed/" target="_blank" rel="noreferrer">
                Event Santa Cruz <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function ShowsPage() {
  return (
    <PageShell eyebrow="Shows" title="Where the records leave the speakers.">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {showItems.map(show => (
          <Card key={show.title} className="overflow-hidden border-white/10 bg-white/[0.035] text-stone-100">
            {show.image && <img className="h-80 w-full object-cover" src={assetPath(show.image)} alt={`${show.title} flyer`} />}
            <CardHeader className="grid gap-3">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{show.status}</Badge>
                  <Badge variant="outline">{show.venue}</Badge>
                </div>
                <CardTitle>{show.title}</CardTitle>
                {(show.date || show.time) && (
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-red-200">
                    {show.date && <span>{show.date}</span>}
                    {show.time && <span>{show.time}</span>}
                  </div>
                )}
                <CardDescription className="mt-2 max-w-3xl text-stone-400">{show.detail}</CardDescription>
              </div>
              <Button asChild variant="outline">
                <a href={show.url} target="_blank" rel="noreferrer">
                  Details <ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mt-8 rounded-md border border-red-400/20 bg-red-500/10 p-5">
        <p className="text-sm leading-6 text-stone-300">
          Upcoming dates can drop here as soon as they are announced. Until then, the live history stays part of the story.
        </p>
      </div>
    </PageShell>
  );
}

function PressPage() {
  return (
    <PageShell eyebrow="Press" title="The city has been paying attention.">
      <div className="grid gap-5 lg:grid-cols-3">
        {pressItems.map(item => (
          <Card key={item.title} className="overflow-hidden border-white/10 bg-white/[0.035] text-stone-100">
            <img className="h-56 w-full object-cover" src={assetPath(item.image)} alt={`${item.outlet} image for ${item.title}`} />
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{item.outlet}</Badge>
                <span className="text-xs text-stone-500">{item.year}</span>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="text-stone-400">{item.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <a href={item.url} target="_blank" rel="noreferrer">
                  Read piece <ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function LabelPage() {
  return (
    <PageShell eyebrow="Label" title="88 Over Everything is the movement.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-red-400/20 bg-red-500/10 text-stone-100">
          <CardHeader>
            <CardTitle className="text-6xl font-black tracking-[-0.05em] text-red-300">88OE</CardTitle>
            <CardDescription className="text-stone-300">
              The banner for the releases, collaborations, visuals, stages, and Santa Cruz-rooted work around Alwa Gordon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-5 bg-white/10" />
            <div className="grid gap-3">
              {["Artist releases", "Local collaborators", "Video drops", "Show nights", "Press"].map(item => (
                <div key={item} className="flex items-center justify-between rounded-md border border-white/10 p-3">
                  <span>{item}</span>
                  <ArrowUpRight className="text-red-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-5 sm:grid-cols-2">
          <FeatureCard icon={Music2} title="Records" copy="Projects, singles, features, credits, and the stories around the music." />
          <FeatureCard icon={Video} title="Visuals" copy="Official videos, live reels, short-form drops, and behind-the-scenes cuts." />
          <FeatureCard icon={CalendarDays} title="Rooms" copy="Shows, venue nights, lineups, and recaps when the energy goes live." />
          <FeatureCard icon={Search} title="Receipts" copy="Press and artist pages stay connected so the story has weight." />
        </div>
      </div>
    </PageShell>
  );
}

function SitemapPage() {
  return (
    <PageShell eyebrow="Sitemap" title="Everything in the Alwa Gordon hub.">
      <div className="grid gap-4 md:grid-cols-2">
        {siteMap.map(item => (
          <Card key={item.title} className="border-white/10 bg-white/[0.035] text-stone-100">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="text-stone-400">{item.target}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <SourceCard />
    </PageShell>
  );
}

function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="page-shell mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 xl:pl-20">
      <div className="mb-10 max-w-4xl">
        <div className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-red-300">
          <span className="h-px w-10 bg-red-400" />
          {eyebrow}
        </div>
        <h2 className="text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-stone-50 sm:text-6xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, copy }: { icon: typeof Sparkles; title: string; copy: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-red-300">
          <Icon />
          {title}
        </div>
        <p className="max-w-2xl text-2xl font-semibold text-stone-100">{copy}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, copy }: { icon: typeof Music2; title: string; copy: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.035] text-stone-100">
      <CardHeader>
        <Icon className="text-red-300" />
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-stone-400">{copy}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof Mic2; value: string; label: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-4">
      <Icon className="mb-3 text-red-300" />
      <div className="text-xl font-black">{value}</div>
      <div className="text-xs uppercase tracking-[0.16em] text-stone-500">{label}</div>
    </div>
  );
}

function MediaPanel({ title, copy, url }: { title: string; copy: string; url: string }) {
  return (
    <Card className="mt-4 border-white/10 bg-white/[0.035] text-stone-100">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-stone-400">{copy}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <a href={url} target="_blank" rel="noreferrer">
            Listen <ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function ReleaseDeepDive({ release }: { release: Release }) {
  return (
    <Card className="border-white/10 bg-white/[0.035] text-stone-100">
      <CardHeader>
        <div className="flex items-start gap-4">
          <img className="size-20 rounded-md object-cover" src={assetPath(release.image)} alt={`${release.title} cover`} />
          <div>
            <CardTitle>{release.title}</CardTitle>
            <CardDescription className="mt-2 text-stone-400">{release.credits}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="track-grid">
          {release.tracks?.map((track, index) => (
            <div key={track} className="track-row">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{track}</strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformGrid() {
  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {platformLinks.map(link => (
        <a key={link.label} className="platform-link" href={link.url} target={link.url.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
          <span>{link.label}</span>
          <p>{link.detail}</p>
          <ArrowUpRight />
        </a>
      ))}
    </div>
  );
}

function SourceCard() {
  return (
    <Card className="mt-8 border-white/10 bg-white/[0.035] text-stone-100">
      <CardHeader>
        <CardTitle>Receipts</CardTitle>
        <CardDescription className="text-stone-400">
          Public references used for the build. Press, bookers, and fans can trace the major facts.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {sources.map(source => (
          <a
            key={source.url}
            className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-stone-300 transition hover:border-red-300/50 hover:text-white"
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {source.label}
            <ArrowUpRight className="text-red-300" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

function Footer({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: PageId) => void }) {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Avatar size="lg">
              <AvatarImage src={assetPath("/alwa/alwa-nexties-lookout.jpg")} alt="Alwa Gordon" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-black uppercase tracking-[0.16em]">Alwa Gordon</div>
              <div className="text-sm text-stone-500">{currentPage}</div>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-stone-400">
            Records, visuals, press, shows, and 88 Over Everything.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <a href="https://alwagordon.bandcamp.com/music" target="_blank" rel="noreferrer">
                  <Headphones />
                  <span className="sr-only">Bandcamp</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bandcamp</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <a href="https://www.youtube.com/results?search_query=Alwa+Gordon" target="_blank" rel="noreferrer">
                  <Youtube />
                  <span className="sr-only">YouTube</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>YouTube</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <a href="https://www.instagram.com/explore/search/keyword/?q=Alwa%20Gordon" target="_blank" rel="noreferrer">
                  <Instagram />
                  <span className="sr-only">Instagram search</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Instagram search</TooltipContent>
          </Tooltip>
          <Button variant="ghost" onClick={() => onNavigate("sitemap")}>
            Sitemap
          </Button>
        </div>
      </div>
    </footer>
  );
}

export default App;
