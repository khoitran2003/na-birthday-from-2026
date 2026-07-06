"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import SecurityGate from "@/components/reader/SecurityGate";
import IntroStatement from "@/components/reader/IntroStatement";
import ClosingStatement from "@/components/reader/ClosingStatement";
import DateInvitation from "@/components/reader/DateInvitation";
import SurveyFeedback from "@/components/reader/SurveyFeedback";

import PolaroidsReader from "@/components/reader/PolaroidsReader";
import ThankYou from "@/components/reader/ThankYou";
import Envelope from "@/components/Envelope";
import AudioPlayer from "@/components/AudioPlayer";

const mockData = {
  recipient: "Na",
  sender: "Bé Tin",
  theme: "royal",
  sealSymbol: "heart",
  sealColor: "#a1183c",
  envelopeStyle: "vintage",
  greeting: "Gửi Na yêu thương,",
  farewell: "Gửi trọn yêu thương,",
  backdrop: "campfire",
  content:
    "Anh làm chiếc web nhỏ này không chỉ để hỏi xem em muốn ăn gì hay đi đâu, mà còn để nhắc em nhớ rằng em đặc biệt đến thế nào. Cảm ơn em vì thời gian qua đã luôn ở đó. Cảm ơn em vì những lúc anh bận rộn hay áp lực nhất, em vẫn luôn bao dung, thấu hiểu và tiếp thêm cho anh rất nhiều động lực. Sự hiện diện của em khiến mọi thứ anh làm đều trở nên có ý nghĩa hơn. 16/07 sắp tới là ngày của em. Hãy cứ gác lại mọi âu lo, chọn những gì em thích nhất, và phần còn lại cứ để anh lo. Anh luôn trân trọng em và tình yêu của chúng mình. Mãi yêu em! ❤️",
  isWriteback: true,
  security: {
    enabled: true,
    type: "choice" as const,
    question: "Nơi 2 đứa hẹn hò đầu tiên",
    answer: "B",
    choices: ["A) Quán Gongcha", "B) Phố đi bộ", "C) Rạp phim"],
  },
  intro: {
    enabled: true,
    text: "Mỗi ngày có em đều là mùa xuân, mỗi đêm có em đều là tổ ấm...",
    animation: "fade-float" as const,
  },
  polaroids: {
    enabled: true,
    items: [
      {
        imageUrl: "/IMG_8316.JPG",
        caption: "Thòi học sinh",
        backText: "Trốn học đi quán cà phê ròi làm jj nè",
      },
      {
        imageUrl: "/4b850223b5acff80fef8ec9cfbb99887.JPG",
        caption: "Anni 1 năm",
        backText: "Lúc này anh mới đi chó nhà em cắn nè",
      },
      {
        imageUrl: "/IMG_5631.JPG",
        caption: "Đi sở thú nè",
        backText: "Sao em cười tươi dữ z em, đi thăm bạn đó đúng hong?",
      },
    ],
    layout: "collage" as const,
    collageStyle: "sunset" as const,
    collageBgPosition: "center" as const,
    collageBgZoom: 1.15,
    title: "Album Kỷ Niệm Polaroid",
    showHearts: true,
  },
  audioMessage: {
    enabled: false,
    audioUrl: "/jordan_voice_over.mp3",
    audioDuration: 18,
    label: "Lời Thì Thầm Giọng Nói 🎙️",
  },
  loveQuiz: {
    enabled: false,
    prizeTitle: "Tấm Vé Vàng Cho Buổi Hẹn Hò 🎟️",
    prizeDesc:
      "Tấm vé này trao quyền cho em có một buổi tối lãng mạn trọn vẹn với nhạc lofi, mì ramen nóng hổi và ngắm sao đêm.",
    strictness: "hearts" as const,
    questions: [
      {
        question:
          "Món ăn yêu thích nhất của chúng mình khi ăn cùng nhau là gì?",
        correctAnswer: "Sushi 🍣",
        incorrectAnswers: ["Tacos 🌮", "Pizza 🍕"],
        hint: "Gợi ý: Chúng mình đã ăn vào dịp kỷ niệm ở nhà hàng nhỏ xinh.",
      },
      {
        question: "Mùa nào trong năm hợp với tình yêu của chúng mình nhất?",
        correctAnswer: "Mùa Thu 🍂",
        incorrectAnswers: ["Mùa Hè ☀️", "Mùa Xuân 🌸"],
        hint: "Gợi ý: Hãy nhớ về những chiếc lá vàng và ly trà ấm.",
      },
      {
        question: "Buổi hẹn hò cà phê đầu tiên của chúng mình ở đâu?",
        correctAnswer: "Quán Cà Phê Nhà Kính 🌿",
        incorrectAnswers: ["Quán Cà Phê Trung Tâm ☕", "Tiệm Bánh Góc Phố 🥐"],
        hint: "Gợi ý: Nơi có nhiều cây xanh và mái kính lung linh.",
      },
    ],
  },
  dateInvite: {
    enabled: true,
    question: "Em có muốn đi hẹn hò cà phê & ngắm sao cùng anh không?",
    activity: "Buổi Hẹn Hò Cà Phê Lofi & Ngắm Sao",
    date: "2026-07-04",
    time: "20:00",
    place: "Điểm Ngắm Đỉnh Đồi",
    mapLink: "https://maps.google.com",
  },
  closing: {
    enabled: true,
    text: "Gặp em như tìm thấy mảnh ghép cuối cùng của cuộc đời anh. Hãy cùng anh viết tiếp những chương tuyệt đẹp nhé...",
    animation: "typewriter" as const,
  },
  survey: {
    enabled: true,
    question: "Bức thư này khiến em cảm thấy như thế nào?",
    type: "both" as const,
  },
};

export default function InteractiveDemoLetter() {
  const [mounted, setMounted] = useState(false);

  // Step transition states
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleStepIndex, setVisibleStepIndex] = useState(0);
  const [triggerFlash, setTriggerFlash] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStepHint = (step: string) => {
    switch (step) {
      case "cover":
        return "Chạm vào bất kỳ đâu trên màn hình để bắt đầu trải nghiệm bức thư tình lãng mạn!";
      case "security":
        return "Trả lời câu hỏi Cổng Bảo Mật. Gợi ý: Chọn đáp án 'B) Quán cà phê ấm cúng trên núi & bungalow rừng ☕' để mở khóa!";
      case "intro":
        return "Đọc lời dẫn nhập, sau đó bấm 'Mở Thư ✉️' để tiến vào phong bì.";
      case "envelope":
        return "Chạm vào dấu phong ấn sáp ở giữa phong bì để mở thư!";
      case "polaroids":
        return "Bấm vào các bức ảnh Polaroid để lật mặt sau và đọc ghi chú. Bấm 'Tiếp Tục ➔' khi hoàn thành.";
      case "audioMessage":
        return "Lắng nghe tin nhắn giọng nói. Bấm 'Tiếp Tục ➔' để sang phần tiếp theo.";
      case "loveQuiz":
        return "Tham gia Trắc Nghiệm Tình Yêu! Trả lời đúng cả 3 câu để nhận Tấm Vé Vàng Hẹn Hò.";
      case "dateInvite":
        return "Xác nhận tham dự buổi hẹn hò lãng mạn. Bạn cũng có thể xem bản đồ địa điểm!";
      case "closing":
        return "Đọc lời kết bức thư, sau đó bấm 'Tiến Tới Đánh Giá ➔' để gửi cảm nhận.";
      case "survey":
        return "Chọn cảm xúc của bạn và gửi đánh giá để hoàn tất trải nghiệm!";
      case "thankYou":
        return "Bạn đã hoàn thành trải nghiệm! Có thể xem lại từ đầu bất cứ lúc nào.";
      default:
        return "Làm theo hướng dẫn trên màn hình để khám phá bức thư!";
    }
  };

  const activeSteps = useMemo(() => {
    return [
      "security",
      "intro",
      "envelope",
      "polaroids",
      "dateInvite",
      "closing",
      "survey",
      "thankYou",
    ];
  }, []);

  const currentStep = activeSteps[visibleStepIndex];
  const [isMusicForcePaused, setIsMusicForcePaused] = useState(false);
  const prevStepRef = useRef(currentStep);

  // Reset showHint when step changes, and detect transition away from audioMessage to pause bg music
  useEffect(() => {
    setShowHint(true);
    prevStepRef.current = currentStep;
  }, [currentStep, showCover]);

  // Determine adjacency of envelope and polaroids
  const envelopeAdjacency = useMemo(() => {
    const envIdx = activeSteps.indexOf("envelope");
    const polIdx = activeSteps.indexOf("polaroids");
    const isAdjacent = Math.abs(envIdx - polIdx) === 1;
    const polaroidsFirst = polIdx < envIdx;
    return { isAdjacent, polaroidsFirst };
  }, [activeSteps]);

  // Reset/Flash animations
  useEffect(() => {
    if (triggerFlash) {
      const timer = setTimeout(() => {
        setTriggerFlash(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [triggerFlash]);

  const handleNextStep = () => {
    if (visibleStepIndex < activeSteps.length - 1) {
      const nextVisibleIndex = visibleStepIndex + 1;
      const unlockingNewStep = nextVisibleIndex > currentStepIndex;
      const nextStepId = activeSteps[nextVisibleIndex];

      const isEnvPolTransition =
        envelopeAdjacency.isAdjacent &&
        ((currentStep === "envelope" && nextStepId === "polaroids") ||
          (currentStep === "polaroids" && nextStepId === "envelope"));

      if (
        nextStepId === "envelope" &&
        unlockingNewStep &&
        !isEnvPolTransition
      ) {
        setTriggerFlash(true);
      }

      if (isEnvPolTransition) {
        if (unlockingNewStep) {
          setCurrentStepIndex(nextVisibleIndex);
        }
        setVisibleStepIndex(nextVisibleIndex);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          if (unlockingNewStep) {
            setCurrentStepIndex(nextVisibleIndex);
          }
          setVisibleStepIndex(nextVisibleIndex);
          setIsTransitioning(false);
        }, 700);
      }
    }
  };

  return (
    <div
      className="glass interactive-demo-box"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "860px",
        minHeight: "680px",
        borderRadius: "24px",
        border: "1px solid var(--border-card)",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "30px 20px",
        margin: "0 auto",
      }}
    >
      {/* Embedded Simulated Backdrop Scenery */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(/pic_4.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Semi-transparent dark wash for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(15, 10, 25, 0.78)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Interactive Letter Experience Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {showCover ? (
          <div
            onClick={() => {
              setHasInteracted(true);
              setShowCover(false);
            }}
            style={{
              width: "100%",
              minHeight: "520px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                animation:
                  "float-up-intro 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--accent-gold)",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  display: "block",
                  marginBottom: "15px",
                }}
              >
                💌 Gửi Na Nóng Nảy
              </span>

              <div
                style={{
                  fontFamily:
                    "'Dancing Script', 'Great Vibes', 'Allura', cursive",
                  fontSize: "58px",
                  color: "#fff",
                  lineHeight: "1.2",
                  textShadow:
                    "0 0 20px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.5)",
                  margin: "24px 0",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontFamily: "var(--font-ui)",
                    fontStyle: "italic",
                    opacity: 0.8,
                    display: "block",
                    margin: "10px 0",
                  }}
                >
                  From
                </span>
                Tin Tủn Tỉn <br />
                <span
                  style={{
                    fontSize: "28px",
                    fontFamily: "var(--font-ui)",
                    fontStyle: "italic",
                    opacity: 0.8,
                    display: "block",
                    margin: "10px 0",
                  }}
                >
                  to
                </span>
                Na Nóng Nảy
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginTop: "50px",
                  animation: "pulse-keyhole 2s infinite ease-in-out",
                  letterSpacing: "1px",
                  fontWeight: "600",
                }}
              >
                Nhấn vào bất cứ đâu để mở ➔
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Timeline Header (Rendered inline inside the section instead of createPortal) */}
            {mounted && currentStep !== "thankYou" && (
              <div
                className="letter-timeline-container"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: "480px",
                  zIndex: 150,
                  padding: "10px 20px 24px 20px",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  margin: "0 auto 20px auto",
                }}
              >
                {/* Timeline connecting line */}
                <div
                  style={{
                    position: "absolute",
                    left: "25px",
                    right: "25px",
                    top: "27px",
                    height: "2px",
                    background: `linear-gradient(to right, 
                  var(--accent-purple) ${(currentStepIndex / (activeSteps.filter((id) => id !== "thankYou").length - 1)) * 100}%, 
                  rgba(255, 255, 255, 0.2) ${(currentStepIndex / (activeSteps.filter((id) => id !== "thankYou").length - 1)) * 100}%
                )`,
                    zIndex: 1,
                    transition: "all 0.5s ease",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    zIndex: 2,
                  }}
                >
                  {activeSteps
                    .filter((id) => id !== "thankYou")
                    .map((stepId, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === visibleStepIndex;
                      const isClickable = idx <= currentStepIndex;

                      let stepIcon = "⚫";
                      let stepTitle = "Step";
                      if (stepId === "security") {
                        stepIcon = "🔒";
                        stepTitle = "Lock";
                      } else if (stepId === "intro") {
                        stepIcon = "✨";
                        stepTitle = "Intro";
                      } else if (stepId === "envelope") {
                        stepIcon = "✉";
                        stepTitle = "Letter";
                      } else if (stepId === "polaroids") {
                        stepIcon = "📸";
                        stepTitle = "Photos";
                      } else if (stepId === "dateInvite") {
                        stepIcon = "🎂";
                        stepTitle = "Lịch Trình";
                      } else if (stepId === "closing") {
                        stepIcon = "✍";
                        stepTitle = "Closing";
                      } else if (stepId === "survey") {
                        stepIcon = "📊";
                        stepTitle = "Survey";
                      }

                      return (
                        <div
                          key={stepId}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                          }}
                          title={stepTitle}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (isClickable && !isTransitioning) {
                                const targetStepId = activeSteps[idx];
                                const isEnvPolTransition =
                                  envelopeAdjacency.isAdjacent &&
                                  ((currentStep === "envelope" &&
                                    targetStepId === "polaroids") ||
                                    (currentStep === "polaroids" &&
                                      targetStepId === "envelope"));

                                if (isEnvPolTransition) {
                                  setVisibleStepIndex(idx);
                                } else {
                                  setIsTransitioning(true);
                                  setTimeout(() => {
                                    setVisibleStepIndex(idx);
                                    setIsTransitioning(false);
                                  }, 700);
                                }
                              }
                            }}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              backgroundColor: isActive
                                ? "var(--accent-rose)"
                                : isCompleted
                                  ? "var(--accent-purple)"
                                  : "rgba(20, 15, 30, 0.85)",
                              border: isActive
                                ? "2px solid #fff"
                                : isCompleted
                                  ? "1.5px solid var(--accent-purple)"
                                  : "1.5px solid var(--border-card)",
                              boxShadow: isActive
                                ? "0 0 12px var(--accent-rose), inset 0 2px 4px rgba(255,255,255,0.2)"
                                : "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              cursor: isClickable ? "pointer" : "default",
                              transition:
                                "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              transform: isActive ? "scale(1.15)" : "scale(1)",
                              color:
                                isActive || isCompleted
                                  ? "#fff"
                                  : "var(--text-muted)",
                              outline: "none",
                            }}
                          >
                            {stepIcon}
                          </button>
                          <span
                            style={{
                              fontSize: "8px",
                              color: "#fff",
                              fontWeight: "bold",
                              marginTop: "4px",
                              position: "absolute",
                              top: "32px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              whiteSpace: "nowrap",
                              padding: "1px 5px",
                              borderRadius: "8px",
                              backgroundColor: isActive
                                ? "rgba(255, 75, 114, 0.85)"
                                : isCompleted
                                  ? "rgba(156, 108, 250, 0.5)"
                                  : "rgba(11, 7, 17, 0.55)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              backdropFilter: "blur(4px)",
                              opacity: isActive ? 1 : isCompleted ? 0.9 : 0.6,
                              transition: "all 0.4s ease",
                            }}
                          >
                            {stepTitle}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Step Transition Frame */}
            <div
              className={
                isTransitioning
                  ? "step-card-transition-exit"
                  : "step-card-transition-active"
              }
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: triggerFlash ? 0 : 1,
                transform: triggerFlash
                  ? "scale(0.98) translateY(10px)"
                  : "scale(1) translateY(0)",
                transition:
                  "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: triggerFlash ? "none" : "auto",
              }}
            >
              {/* Step 1: Security Lock Gate */}
              {currentStep === "security" && mockData.security && (
                <SecurityGate
                  securityData={mockData.security}
                  onSuccess={handleNextStep}
                  preview={true}
                />
              )}

              {/* Step 2: Introductory Statement */}
              {currentStep === "intro" && mockData.intro && (
                <IntroStatement
                  text={mockData.intro.text}
                  animation={mockData.intro.animation}
                  onComplete={handleNextStep}
                  preview={true}
                />
              )}

              {/* Step 3: Unified Envelope / Polaroid Stack */}
              {(currentStep === "envelope" ||
                (currentStep === "polaroids" &&
                  envelopeAdjacency.isAdjacent)) && (
                <Envelope
                  recipient={mockData.recipient}
                  sender={mockData.sender}
                  content={mockData.content}
                  theme={mockData.theme}
                  sealSymbol={mockData.sealSymbol}
                  sealColor={mockData.sealColor}
                  envelopeStyle={mockData.envelopeStyle}
                  greeting={mockData.greeting}
                  farewell={mockData.farewell}
                  backdrop={mockData.backdrop}
                  isOnlyStep={false}
                  polaroids={mockData.polaroids?.items}
                  polaroidsLayout={mockData.polaroids?.layout}
                  polaroidsCollageStyle={mockData.polaroids?.collageStyle}
                  polaroidsCollageBgPosition={
                    mockData.polaroids?.collageBgPosition
                  }
                  polaroidsCollageBgZoom={mockData.polaroids?.collageBgZoom}
                  polaroidsTitle={mockData.polaroids?.title}
                  polaroidsShowHearts={mockData.polaroids?.showHearts}
                  activeStep={currentStep}
                  onStepComplete={handleNextStep}
                  isAdjacentToPolaroids={envelopeAdjacency.isAdjacent}
                  polaroidsFirst={envelopeAdjacency.polaroidsFirst}
                  onClose={handleNextStep}
                  preview={true}
                />
              )}

              {/* Step 4: Standalone Polaroids fallback (if not adjacent, but adjacent here) */}
              {!envelopeAdjacency.isAdjacent &&
                currentStep === "polaroids" &&
                mockData.polaroids && (
                  <PolaroidsReader
                    polaroids={mockData.polaroids.items}
                    theme={mockData.theme}
                    onComplete={handleNextStep}
                    isSheetExpanded={true}
                    isStandalone={true}
                    layout={mockData.polaroids.layout}
                    collageStyle={mockData.polaroids.collageStyle}
                    collageBgPosition={mockData.polaroids.collageBgPosition}
                    collageBgZoom={mockData.polaroids.collageBgZoom}
                    title={mockData.polaroids.title}
                    showHearts={mockData.polaroids.showHearts}
                    sender={mockData.sender}
                  />
                )}

              {/* Step 7: Date Invitation ticket pass */}
              {currentStep === "dateInvite" && mockData.dateInvite && (
                <DateInvitation
                  dateInvite={mockData.dateInvite}
                  sender={mockData.sender}
                  recipient={mockData.recipient}
                  letterKey="preview"
                  preview={true}
                  onComplete={handleNextStep}
                />
              )}

              {/* Step 8: Closing Statement */}
              {currentStep === "closing" && mockData.closing && (
                <ClosingStatement
                  text={mockData.closing.text}
                  animation={mockData.closing.animation}
                  isLastStep={false}
                  onComplete={handleNextStep}
                  preview={true}
                />
              )}

              {/* Step 9: Post-Letter Survey */}
              {currentStep === "survey" && mockData.survey && (
                <SurveyFeedback
                  survey={mockData.survey}
                  sender={mockData.sender}
                  recipient={mockData.recipient}
                  letterKey="preview"
                  preview={true}
                  onComplete={handleNextStep}
                />
              )}

              {/* Step 10: Thank You Screen */}
              {currentStep === "thankYou" && (
                <ThankYou
                  sender={mockData.sender}
                  recipient={mockData.recipient}
                  content={mockData.content}
                  theme={mockData.theme}
                  isWriteback={mockData.isWriteback}
                  preview={true}
                  onReplay={() => {
                    setCurrentStepIndex(0);
                    setVisibleStepIndex(0);
                    setShowCover(true);
                    setHasInteracted(false);
                  }}
                  onExit={() => {
                    setCurrentStepIndex(0);
                    setVisibleStepIndex(0);
                    setShowCover(true);
                    setHasInteracted(false);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes float-hint-entry {
          0% { opacity: 0; transform: translate(-50%, 15px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes bounce-hint {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <AudioPlayer
        autoplay={false}
        musicType="url"
        musicUrl="/cant_help_falling_in_love.mp3"
        preview={true}
        visible={false}
        isForcePaused={isMusicForcePaused}
        onTogglePlayback={(playing) => {
          if (playing) {
            setIsMusicForcePaused(false);
          }
        }}
      />

      {triggerFlash && <div className="blinding-flash-active" />}
    </div>
  );
}
