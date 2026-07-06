"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import "./landing.css";
import { usePagePerformanceLogger, logPerformanceMetric } from "@/utils/performance";

const FloatingHearts = dynamic(() => import("@/components/FloatingHearts"), { ssr: false });
const InteractiveDemoLetter = dynamic(() => import("@/components/InteractiveDemoLetter"), { ssr: false });
const AudioPlayer = dynamic(() => import("@/components/AudioPlayer"), { ssr: false });

const backgrounds = [
  { id: "hero", url: "/IMG_6296.JPG", overlay: "rgba(9, 6, 14, 0.65)" },
  { id: "story", url: "/IMG_6336.JPG", overlay: "rgba(9, 6, 14, 0.78)" },
  { id: "demo", url: "/pic_10.jpg", overlay: "rgba(9, 6, 14, 0.76)" },
  { id: "features", url: "/IMG_6596.jpg", overlay: "rgba(9, 6, 14, 0.75)" },
  { id: "faq-contact", url: "/IMG20250615103754.JPG", overlay: "rgba(9, 6, 14, 0.82)" }
];

const featuresData = [
  {
    id: 1,
    title: "Siêu Saiyan nè 🦹🏻",
    icon: "🦹🏻",
    image: "/1/IMG_0991.jpg",
    gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    rotate: "-3deg",
    offsetX: "-5px",
    offsetY: "-5px"
  },
  {
    id: 2,
    title: "Đi Suối Tiên nè 🎡",
    icon: "⏳",
    image: "/1/IMG_1315.jpg",
    gradient: "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)",
    rotate: "4deg",
    offsetX: "8px",
    offsetY: "-2px"
  },
  {
    id: 3,
    title: "Vĩnh Hy nè 🌊",
    icon: "🔑",
    image: "/1/IMG_3425.JPG",
    gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    rotate: "-2deg",
    offsetX: "-8px",
    offsetY: "6px"
  },
  {
    id: 4,
    title: "Sinh Nhật anh nè 🎂",
    icon: "🎵",
    image: "/1/IMG_3870.jpg",
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    rotate: "3deg",
    offsetX: "6px",
    offsetY: "8px"
  },
  {
    id: 5,
    title: "Giấc mơ Của Na 💤",
    icon: "📸",
    image: "/1/IMG_3628.JPG",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    rotate: "-4deg",
    offsetX: "-4px",
    offsetY: "-8px"
  },
  {
    id: 6,
    title: "Em tốt nghiệp nè 👩🏻‍🎓",
    icon: "🧩",
    image: "/1/IMG_4941.JPG",
    gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    rotate: "2deg",
    offsetX: "4px",
    offsetY: "-4px"
  },
  {
    id: 7,
    title: "Ngắm em ngủ nè 😴",
    icon: "🎙️",
    image: "/1/IMG_4960.jpg",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    rotate: "-3deg",
    offsetX: "-6px",
    offsetY: "4px"
  },
  {
    id: 8,
    title: "Đức Bà By Night nè ",
    icon: "🎟️",
    image: "/1/IMG_5245.jpg",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    rotate: "4deg",
    offsetX: "8px",
    offsetY: "2px"
  },
  {
    id: 9,
    title: "Chụp hình học sinh nè 👩‍❤️‍👨",
    icon: "✍️",
    image: "/1/IMG_6274.JPG",
    gradient: "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)",
    rotate: "-1deg",
    offsetX: "-2px",
    offsetY: "6px"
  },
  {
    id: 10,
    title: "Tặng bé một ly tà tữa siu to khủm lò nè 🧋",
    icon: "🟢",
    image: "/1/IMG_7968.jpg",
    gradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    rotate: "3deg",
    offsetX: "6px",
    offsetY: "-6px"
  }
];

export default function LandingClientPage() {
  usePagePerformanceLogger("landing");
  const user = null;
  const loading = false;
  const [mounted, setMounted] = useState(false);

  const [polaroidStack, setPolaroidStack] = useState([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  const [slidingCardIndex, setSlidingCardIndex] = useState<number | null>(null);

  const cyclePolaroid = () => {
    if (slidingCardIndex !== null) return;
    const topCardIndex = polaroidStack[polaroidStack.length - 1];
    setSlidingCardIndex(topCardIndex);

    setTimeout(() => {
      setPolaroidStack(prev => {
        const nextStack = [...prev];
        const top = nextStack.pop();
        if (top !== undefined) {
          nextStack.unshift(top);
        }
        return nextStack;
      });
      setSlidingCardIndex(null);
    }, 450);
  };

  // Typewriter effect statements based on the latest features
  const statements = [
    { prefix: "Chào mừng sinh nhật của ", suffix: "Na công chúa" },
    { prefix: "Cấp quyền VIP lên lịch cho ", suffix: "ngày đặc biệt" },
    { prefix: "Chọn hương vị vỗ về ", suffix: "chiếc bụng đói" },
    { prefix: "Chuẩn bị lên đồ lượn quanh ", suffix: "Sài Gòn nhé" },
    { prefix: "Chọn màu sắc chiếm trọn ", suffix: "spotlight đêm nay" },
    { prefix: "Gửi gắm những yêu sách cho ", suffix: "ban tổ chức" },
    { prefix: "Chốt đơn ngay để nhận ", suffix: "bất ngờ to bự" }
  ];

  const [statementIndex, setStatementIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);



  // Parallax scroll states
  const [scrollY, setScrollY] = useState(0);
  const [bgOpacities, setBgOpacities] = useState<number[]>([1, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);

          const viewportMid = currentScrollY + window.innerHeight / 2;
          const heroEl = document.querySelector(".landing-hero");
          const storyEl = document.getElementById("story");
          const howItWorksEl = document.getElementById("how-it-works");
          const demoEl = document.getElementById("demo");
          const featuresEl = document.getElementById("features");

          const elements = [heroEl, storyEl, howItWorksEl, demoEl, featuresEl];
          
          // Calculate midpoint coordinates relative to document
          const midpoints = elements.map((el) => {
            if (!el) return 0;
            const rect = el.getBoundingClientRect();
            return rect.top + currentScrollY + rect.height / 2;
          });

          const newOpacities = new Array(elements.length).fill(0);

          if (viewportMid <= midpoints[0]) {
            newOpacities[0] = 1;
          } else if (viewportMid >= midpoints[midpoints.length - 1]) {
            newOpacities[newOpacities.length - 1] = 1;
          } else {
            for (let i = 0; i < midpoints.length - 1; i++) {
              const m1 = midpoints[i];
              const m2 = midpoints[i + 1];
              if (viewportMid >= m1 && viewportMid <= m2) {
                const ratio = (viewportMid - m1) / (m2 - m1);
                // Cosine interpolation for organic ease-in-out crossfade
                const smoothRatio = (1 - Math.cos(ratio * Math.PI)) / 2;
                newOpacities[i] = 1 - smoothRatio;
                newOpacities[i + 1] = smoothRatio;
                break;
              }
            }
          }
          setBgOpacities(newOpacities);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const targets = document.querySelectorAll(".reveal-on-scroll");
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    let timer: NodeJS.Timeout;
    const current = statements[statementIndex];
    const currentFullText = current.prefix + current.suffix;

    if (!isDeleting) {
      if (displayedText !== currentFullText) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Entire statement typed, wait 3 seconds before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(25); // Delete faster
        }, 3000);
      }
    } else {
      if (displayedText !== "") {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, typingSpeed);
      } else {
        // Fully deleted, move to next statement
        setIsDeleting(false);
        setStatementIndex((prev) => (prev + 1) % statements.length);
        setTypingSpeed(50); // Reset typing speed
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, statementIndex, typingSpeed, mounted]);

  return (
    <div className="landing-page-root" suppressHydrationWarning={true} style={{ 
      minHeight: "100vh", 
      width: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative", 
      overflowX: "hidden"
    }}>
      {/* Parallax varying backgrounds */}
      <div className="fixed-parallax-bg-container">
        {backgrounds.map((bg, idx) => {
          const opacity = bgOpacities[idx] ?? 0;
          const translation = Math.max(-50, Math.min(50, scrollY * -0.035));
          return (
            <div
              key={bg.id}
              className="parallax-bg-layer"
              style={{
                backgroundImage: `linear-gradient(${bg.overlay}, ${bg.overlay}), url(${bg.url})`,
                opacity: opacity,
                transform: `translateY(${translation}px) scale(1.15)`,
              }}
            />
          );
        })}
      </div>

      {/* Floating Hearts background */}
      <FloatingHearts />

      {/* Top Header Navigation */}
      <header 
        className="glass"
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 100,
          borderRadius: "0px",
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          borderBottom: "1px solid var(--border-card)",
          background: "rgba(11, 7, 17, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)"
        }}
      >
        <div 
          style={{ 
            maxWidth: "1200px", 
            margin: "0 auto", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "20px 24px"
          }}
        >
          {/* Logo */}
          <Link 
            href="/"
            className="header-logo-container"
            style={{ 
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <img 
              src="/pic_13.png" 
              alt="EverAfter Logo" 
              className="header-logo-img"
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "8px", 
                objectFit: "cover",
                boxShadow: "0 0 10px rgba(255, 75, 114, 0.3)",
                border: "1.5px solid rgba(255, 255, 255, 0.1)"
              }} 
            />
            <span 
              className="header-logo-text"
              style={{ 
                fontSize: "36px", 
                fontWeight: "normal", 
                fontFamily: "'Dancing Script', 'Great Vibes', 'Sacramento', cursive", 
                background: "linear-gradient(to right, #ff4b72, #9c6cfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Na's Birthday
            </span>
          </Link>



          {/* Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link 
              href="#demo"
              className="header-dashboard-btn"
              style={{
                fontSize: "14px",
                color: "var(--text-main)",
                textDecoration: "none",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "10px 24px",
                borderRadius: "30px",
                transition: "all 0.3s ease",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-rose)";
                e.currentTarget.style.color = "var(--accent-rose)";
                e.currentTarget.style.backgroundColor = "rgba(255, 75, 114, 0.05)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 75, 114, 0.2)";
                const svg = e.currentTarget.querySelector("svg");
                if (svg) svg.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.color = "var(--text-main)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.boxShadow = "inset 0 1px 1px rgba(255,255,255,0.1)";
                const svg = e.currentTarget.querySelector("svg");
                if (svg) svg.style.transform = "none";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"></path>
              </svg>
              <span>Yêu cầu từ Na</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="landing-main" suppressHydrationWarning={true} style={{ width: "100%", maxWidth: "1200px", margin: "140px auto 0 auto", padding: "0 24px", flexGrow: 1, overflowX: "hidden", boxSizing: "border-box" }}>
        
        {/* HERO SECTION */}
        <section className="landing-hero" style={{ gap: "40px", alignItems: "center", minHeight: "500px", marginBottom: "80px" }}>
          
          <div className="landing-hero-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Tagline of the App */}
            <div style={{ 
              display: "inline-flex", 
              flexWrap: "wrap",
              alignItems: "center", 
              gap: "6px", 
              backgroundColor: "rgba(255, 75, 114, 0.1)", 
              color: "var(--accent-rose)", 
              padding: "6px 16px", 
              borderRadius: "20px", 
              fontSize: "12px", 
              fontWeight: 600, 
              letterSpacing: "0.5px",
              width: "fit-content",
              maxWidth: "100%",
              boxSizing: "border-box",
              textTransform: "uppercase",
              border: "1px solid rgba(255, 75, 114, 0.15)"
            }}>
              <span>🌸</span> Ngày đặc biệt dành cho Na 
            </div>

            {/* Typewriter H1 Headline */}
            <h1 className="landing-hero-title" style={{ 
              fontSize: "48px", 
              fontWeight: "normal", 
              lineHeight: "1.3", 
              color: "#ffffff",
              fontFamily: "var(--font-cursive)",
              letterSpacing: "0.5px",
              minHeight: "130px",
              width: "100%",
              boxSizing: "border-box",
              overflow: "visible",
              margin: "0"
            }}>
              {mounted ? (
                <>
                  {displayedText.slice(0, statements[statementIndex].prefix.length)}
                  {displayedText.length > statements[statementIndex].prefix.length && (
                    <span style={{ background: "linear-gradient(to right, #ff4b72, #e2b857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {displayedText.slice(statements[statementIndex].prefix.length)}
                    </span>
                  )}
                  <span className="typewriter-cursor"></span>
                </>
              ) : (
                <>
                  Viết những bức thư sống mãi <span style={{ background: "linear-gradient(to right, #ff4b72, #e2b857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>cùng thời gian.</span>
                </>
              )}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
              <a
                href="#demo"
                className="cta-button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 36px",
                  borderRadius: "30px",
                  backgroundColor: "var(--accent-rose)",
                  backgroundImage: "linear-gradient(135deg, #ff4b72, #d9264c)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "16px",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(255, 75, 114, 0.35)",
                  cursor: "pointer"
                }}
              >
                <span className="cta-icon-animate">✨</span>
                Cùng chơi trò chơi này nha ✨
              </a>
            </div>
          </div>

          {/* Interactive Envelope Preview */}
          <div 
            className="hero-envelope-column parallax-element" 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              width: "100%",
              transform: `translateY(${Math.max(-40, Math.min(40, scrollY * 0.05))}px)`
            }}
          >
            <div style={{ animation: "gentle-float 6s ease-in-out infinite", width: "100%", display: "flex", justifyContent: "center" }}>
              <div className="demo-envelope-wrapper-parent" style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible", position: "relative" }}>
              <div className="envelope-wrapper vintage-rose-style demo-envelope-container">
                <div className="envelope vintage-rose-style" style={{
                  "--env-bg-image": "url(/pic_30.png)",
                  "--env-flap-image": "url(/pic_29.png)",
                  "--env-bg-pos": "-81.7px -278px",
                  "--env-flap-pos": "-81.7px -32.8px",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none"
                } as React.CSSProperties}>
                  <div className="vintage-envelope-back" />
                  <div className="envelope-letter theme-royal" style={{ background: "#fcf8ee", border: "4px double #c3a175" }}>
                    <div style={{ fontSize: "24px", fontFamily: "'Dancing Script', cursive", fontWeight: "bold", color: "#590d22", marginBottom: "4px" }}>Gửi Na yêu thương,</div>
                    <div style={{ fontSize: "15px", fontFamily: "'Playfair Display', serif", lineHeight: "1.6", color: "#4a2c11" }}>
                      "Từ khoảnh khắc ta gặp nhau, anh đã biết em là định mệnh của cuộc đời anh. Những lời này gửi trọn trái tim anh..."
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", fontSize: "11px", fontFamily: "var(--font-ui)", color: "#c3a175" }}>
                      <span>Mở khóa vào ngày kỷ niệm ⏳</span>
                      <span>Gửi trọn yêu thương ❤️</span>
                    </div>
                  </div>
                  <div className="vintage-envelope-front-pocket">
                    {/* Mock Delivery Address */}
                    <div 
                      className="envelope-mock-address" 
                      style={{ 
                        position: "absolute",
                        bottom: "25px",
                        right: "35px",
                        fontFamily: "var(--font-ui)",
                        fontSize: "13px",
                        color: "#6b5952",
                        textAlign: "left",
                        lineHeight: "1.2",
                        zIndex: 7,
                        pointerEvents: "none",
                        maxWidth: "220px",
                      }}
                    >
                      <div style={{ fontSize: "8px", fontFamily: "var(--font-ui)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px", color: "#9e867c" }}>Người Nhận:</div>
                      <div style={{ fontWeight: "bold", fontSize: "16px", color: "#4a2c11" }}>Công chúa Na</div>
                      <div>182/69/10 Chiến Lược</div>
                      <div>Bình Trị Đông, Hồ Chí Minh</div>
                    </div>
                  </div>
                  <div className="vintage-envelope-flap-part" style={{ backgroundPosition: "-81.7px -32.8px" }} />
                  <div className="wax-seal vintage-rose-style" style={{
                    "--seal-color-main": "#b38f36",
                    "--seal-color-light": "#ffd670",
                    "--seal-color-dark": "#7a5c18",
                    "--seal-bg-image": "url(/pic_27.png)",
                    width: "106px",
                    height: "106px",
                    left: "calc(50% - 53px)",
                    top: "167px"
                  } as React.CSSProperties}>
                    <div className="wax-seal-quarter top-left" />
                    <div className="wax-seal-quarter top-right" />
                    <div className="wax-seal-quarter bottom-left" />
                    <div className="wax-seal-quarter bottom-right" />
                  </div>
                </div>
              </div>
            </div>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", marginTop: "12px" }}>
              Rê chuột/Chạm vào dấu phong ấn để mở thư ✉️
            </p>
          </div>

        </section>

        {/* STORYTELLING SECTION */}
        <section className="story-section" id="story">
          <h2 className="story-section-title reveal-on-scroll">Câu Chuyện Tình Yêu Theo Thời Gian</h2>

          {/* Scene 1: Once upon a time... */}
          <div className="story-scene reveal-on-scroll">
            <div 
              className="story-scene-visual parallax-element"
              style={{
                transform: `translateY(${(scrollY - 900) * 0.04}px)`
              }}
            >
              <Image 
                src="/IMG_6277.JPG" 
                alt="Bức thư tay lãng mạn dưới ánh nến" 
                width={420}
                height={280}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "420px",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  border: "1.5px solid rgba(255, 255, 255, 0.05)"
                }}
              />
            </div>
            <div 
              className="story-scene-text parallax-element"
              style={{
                transform: `translateY(${(scrollY - 900) * -0.02}px)`
              }}
            >
              <h3>Ngày xửa ngày xưa...</h3>
              <p className="story-lead">
                Có một cậu bé tên là Tin Tủn Tỉn
              </p>
              <p>
                Cậu đã để ý, thầm yêu cô bé tên là Na Nóng Nảy<br />
                Mỗi ngày cậu đều quan sát cô gái ấy nhưng không dám ngỏ lời<br />
                Cậu giấu mãi trong lòng, chỉ biết gửi mong tình yêu thương qua những dòng tin nhắn.
              </p>
              <p>
                Tình yêu không chỉ là những lời nói qua loa.<br />
                Rồi bỗng 1 ngày cậu đã lấy hết dũng khí để bày tỏ.
              </p>
            </div>
          </div>

          {/* Scene 2: Today... */}
          <div className="story-scene reveal-on-scroll">
            <div 
              className="story-scene-text parallax-element"
              style={{
                transform: `translateY(${(scrollY - 1500) * -0.02}px)`
              }}
            >
              <h3>Ngày nay...</h3>
              <p className="story-lead">
                Chúng ta đã bên nhau được gần 6 năm
              </p>
              <p>
                Mọi vui, buồn, khó khăn hay sung sướng, chúng ta đều trải qua cùng nhau
              </p>
              <p>
                Cảm ơn em, đã luôn đồng hành cùng anh, đã luôn tha thứ, đồng cảm và chấp nhận ở bên anh
              </p>
            </div>
            <div 
              className="story-scene-visual parallax-element"
              style={{
                transform: `translateY(${(scrollY - 1500) * 0.04}px)`
              }}
            >
              {/* CSS Smartphone Mockup */}
              <div className="smartphone-mockup">
                <div className="smartphone-header">
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>8:41 PM</span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>📶 🔋</span>
                </div>
                
                <div className="smartphone-chat-bubble left">
                  Ê
                </div>
                <div className="smartphone-chat-bubble left">
                  20/11 đi chơi hong :))
                </div>
                <div className="smartphone-chat-bubble right important">
                  Chứ hong phải bữa bà nói bận j đó hả
                </div>
                <div className="smartphone-chat-bubble left">
                  Hết bận ời
                </div>
                <div className="smartphone-chat-bubble left">
                  H đi hong :))
                </div>
                <div className="smartphone-chat-bubble left">
                  Hogn đi thì thoii
                </div>
                <div className="smartphone-chat-bubble right important">
                  Điii :”)))
                </div>
                <div className="smartphone-input-bar">
                  Nhập tin nhắn...
                </div>
              </div>
            </div>
          </div>

          {/* Scene 3: What if... */}
          <div className="story-scene reveal-on-scroll">
            <div 
              className="story-scene-visual parallax-element"
              style={{
                transform: `translateY(${(scrollY - 2100) * 0.04}px)`
              }}
            >
              {/* CSS EverAfter Showcase Card Vault */}
              <div className="everafter-showcase">
                {/* Central Mock Letter Canvas representing Elegant Stationery */}
                <div className="mock-letter-canvas">
                  <div className="mock-letter-paper">
                    <div className="mock-letter-header">
                      <span className="mock-letter-title">Na yêu dấu...</span>
                      {/* Background music indicator */}
                      <span className="mock-music-badge">
                        <span className="music-icon">🎵</span>
                        <span className="music-text">Nhạc Lofi Lãng Mạn</span>
                        <span className="music-waves">
                          <span className="wave-bar"></span>
                          <span className="wave-bar"></span>
                          <span className="wave-bar"></span>
                        </span>
                      </span>
                    </div>
                    
                    <div className="mock-letter-body">
                      <p>Nà nà na ná nà nà na.....</p>
                      <p>Nà nà na ná nà nà na.....</p>
                      <p>Nà nà na ná nà nà na.....</p>
                      <p>Nà nà na ná nà nà na.....</p>
                      <p>Nà nà na ná nà nà na.....</p>
                    </div>

                    <div className="mock-letter-widgets">
                      <div className="mock-voice-note">
                        <span className="voice-icon">🎙️</span>
                        <div className="voice-waveform">
                          <span className="voice-bar"></span>
                          <span className="voice-bar"></span>
                          <span className="voice-bar"></span>
                          <span className="voice-bar"></span>
                          <span className="voice-bar"></span>
                        </div>
                        <span className="voice-duration">0:24</span>
                      </div>
                    </div>
                  </div>

                  {/* Overlapping Polaroid Photo */}
                  <div className="mock-polaroid">
                    <div className="polaroid-image" style={{ overflow: "hidden" }}>
                      <Image 
                        src="/519208025_2582784498730794_1789095691964944652_n.jpg" 
                        alt="Sinh nhật Na 2025" 
                        width={100} 
                        height={80} 
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "3px" }} 
                      />
                    </div>
                    <div className="polaroid-caption" suppressHydrationWarning={true}>Sinh nhật Na 2025</div>
                  </div>
                </div>

                {/* Floating Envelope Badge */}
                <div className="showcase-floating-card showcase-card-envelope">
                  <span>😘</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "11px", fontWeight: "bold", color: "#fff" }}>Ngàn nụ hunnn</div>
                    <div style={{ fontSize: "8px", color: "var(--text-muted)" }}>Thắm thiết</div>
                  </div>
                </div>

                {/* Floating Memory Chest Badge */}
                <div className="showcase-floating-card showcase-card-chest">
                  <span>🙆🏻‍♂️</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "11px", fontWeight: "bold", color: "#fff" }}>Trịu cái ôm</div>
                    <div style={{ fontSize: "8px", color: "var(--text-muted)" }}>Siết chặt</div>
                  </div>
                </div>
              </div>
            </div>
            <div 
              className="story-scene-text parallax-element"
              style={{
                transform: `translateY(${(scrollY - 2100) * -0.02}px)`
              }}
            >
              <div>
              <h3>Gửi nhân vật chính...</h3>
              <p className="story-lead">
                Chỉ còn vài ngày nữa là đến khoảnh khắc đặc biệt nhất trong năm của Na.
              </p>
              <p>
                Thay vì tự đoán mò rồi lên lịch trình rập khuôn, anh muốn ngày hôm đó phải là một trải nghiệm được "may đo" hoàn hảo theo ý em.
              </p>
              <p>Hãy chọn hương vị vỗ về chiếc bụng đói.</p>
              <p>Hãy chọn nơi chốn khiến em mỉm cười.</p>
              <p>Nhiệm vụ của em là đưa ra chỉ thị, thực thi cứ để anh lo nhé!</p>
            </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMO PLAYGROUND SECTION */}
        <section id="demo" style={{ marginBottom: "100px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "12px", color: "var(--accent-rose)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "2px" }}>Bé Na chơi trò chơi nha</span>
            <h2 style={{ fontSize: "46px", fontWeight: "normal", fontFamily: "var(--font-cursive)", marginTop: "8px" }}>Quiz đơn giản hoi</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "600px", margin: "8px auto 0 auto" }}>
              Bé Na nhớ kĩ rùi trả lời mấy câu hỏi dưới đây nha!
            </p>
          </div>

          <InteractiveDemoLetter />
        </section>

        {/* FEATURES STACK */}
        <section id="features" style={{ marginBottom: "100px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "48px", fontWeight: "normal", marginBottom: "12px", fontFamily: "var(--font-cursive)" }}>
              Cùng nhau nè
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              Những hình ảnh lưu giữ khoảnh khắc của hai đứa mình
            </p>
          </div>

          <div className="features-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
            {/* Centered Polaroid Stack */}
            <div className="features-stack-column" style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="polaroid-stack-container" style={{ position: "relative", width: "320px", height: "420px" }}>
                {polaroidStack.map((cardIndex, zIndex) => {
                  const card = featuresData[cardIndex];
                  const isTop = zIndex === polaroidStack.length - 1;
                  const isSliding = slidingCardIndex === cardIndex;

                  const organicRotate = card.rotate;
                  const organicX = card.offsetX;
                  const organicY = card.offsetY;

                  const transform = isSliding
                    ? "" // slide-out CSS takes over
                    : `rotate(${organicRotate}) translate(${organicX}, ${organicY}) scale(${isTop ? 1 : 0.95})`;

                  return (
                    <div
                      key={card.id}
                      className={`polaroid-card ${isSliding ? "slide-out" : ""}`}
                      onClick={cyclePolaroid}
                      style={{
                        zIndex: zIndex,
                        transform: transform,
                        opacity: isTop || isSliding ? 1 : 0.85
                      }}
                    >
                      <div className="polaroid-photo-area" style={{ background: card.gradient, overflow: "hidden" }}>
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span>{card.icon}</span>
                        )}
                      </div>
                      <div className="polaroid-caption-area">
                        <h3 className="polaroid-card-title">{card.title}</h3>
                        {(card as any).desc && <p className="polaroid-card-desc">{(card as any).desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "-10px", fontStyle: "italic", textAlign: "center" }}>
                📸 Bấm vào ảnh Polaroid để khám phá thêm các tính năng!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer 
        suppressHydrationWarning={true}
        style={{
          marginTop: "auto",
          textAlign: "center",
          padding: "40px 20px",
          fontSize: "14px",
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border-card)",
          background: "rgba(7, 5, 11, 0.95)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontFamily: "var(--font-ui)",
          letterSpacing: "0.5px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 10
        }}
      >
        <div style={{ color: "var(--text-main)", fontWeight: 500 }}>
          Enkoi © {new Date().getFullYear()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>Dành tặng Na với tất cả tình yêu thương ❤️</span>
        </div>
      </footer>

      {/* Global Background Audio Player */}
      <AudioPlayer 
        autoplay={true}
        musicType="url"
        musicUrl="/cant_help_falling_in_love.mp3"
        preview={false}
        visible={false}
      />
    </div>
  );
}
