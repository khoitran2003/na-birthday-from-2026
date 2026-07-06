"use client";

import React, { useState, useEffect } from "react";

interface DateInvitationProps {
  dateInvite?: any;
  sender?: string;
  recipient?: string;
  letterKey?: string;
  letterId?: string;
  senderEmail?: string;
  preview?: boolean;
  onComplete: () => void;
}

export default function DateInvitation({
  dateInvite,
  sender = "Bé Tin",
  recipient = "Na",
  letterKey,
  letterId,
  senderEmail,
  preview = false,
  onComplete,
}: DateInvitationProps) {
  // Survey Form States
  const [currentSlide, setCurrentSlide] = useState<number>(0); // 0, 1, 2, 3
  const [food, setFood] = useState<string>("🥩 Đồ Âu");
  const [otherFoodText, setOtherFoodText] = useState<string>("");
  const [activities, setActivities] = useState<string[]>([
    "🌃 Lượn lờ ngắm phố phường Sài Gòn",
  ]);
  const [isOtherActivitySelected, setIsOtherActivitySelected] =
    useState<boolean>(false);
  const [otherActivityText, setOtherActivityText] = useState<string>("");
  const [dresscode, setDresscode] = useState<string>("Trắng");
  const [otherDresscodeText, setOtherDresscodeText] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [hearts, setHearts] = useState<
    {
      id: number;
      char: string;
      tx: string;
      ty: string;
      scale: number;
      rot: string;
    }[]
  >([]);

  const getDateKey = () => {
    if (letterId) return letterId;
    if (letterKey && letterKey !== "preview") {
      let hash = 0;
      for (let i = 0; i < letterKey.length; i++) {
        hash = (hash << 5) - hash + letterKey.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(36);
    }
    return "preview";
  };

  useEffect(() => {
    if (preview) {
      setIsSubmitted(false);
      setCurrentSlide(0);
      return;
    }

    const keyPart = getDateKey();
    const cachedStr = localStorage.getItem(`na_birthday_plan_${keyPart}`);
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        if (cached.food) setFood(cached.food);
        if (cached.otherFoodText) setOtherFoodText(cached.otherFoodText);
        if (cached.activities) setActivities(cached.activities);
        if (cached.dresscode) setDresscode(cached.dresscode);
        if (cached.otherDresscodeText)
          setOtherDresscodeText(cached.otherDresscodeText);
        if (cached.notes) setNotes(cached.notes);
        if (cached.otherActivityText) {
          setOtherActivityText(cached.otherActivityText);
          setIsOtherActivitySelected(true);
        }
        setIsSubmitted(true);
      } catch (e) {
        console.error("Failed to parse cached plan:", e);
      }
    }
  }, [letterKey, letterId, preview]);

  const toggleActivity = (act: string) => {
    if (activities.includes(act)) {
      if (activities.length > 1 || isOtherActivitySelected) {
        setActivities(activities.filter((a) => a !== act));
      }
    } else {
      setActivities([...activities, act]);
    }
  };

  const triggerHeartsBurst = () => {
    const heartsList = ["❤️", "💖", "💝", "💕", "✨", "🌸", "🎉"];
    const newBursts = [];
    for (let i = 0; i < 24; i++) {
      const char = heartsList[Math.floor(Math.random() * heartsList.length)];
      const tx = `${(Math.random() - 0.5) * 340}px`;
      const ty = `${-100 - Math.random() * 240}px`;
      const scale = Math.random() * 0.9 + 0.6;
      const rot = `${(Math.random() - 0.5) * 180}deg`;
      newBursts.push({ id: i, char, tx, ty, scale, rot });
    }
    setHearts(newBursts);
  };

  const getFinalFood = () => {
    if (food === "✨ Khác (Nhập món riêng em thích)" && otherFoodText.trim()) {
      return `💡 Khác: ${otherFoodText.trim()}`;
    }
    return food;
  };

  const getCombinedActivities = () => {
    const list = [...activities];
    if (isOtherActivitySelected && otherActivityText.trim()) {
      list.push(`💡 Khác: ${otherActivityText.trim()}`);
    }
    return list;
  };

  const getFinalDresscode = () => {
    if (dresscode === "Khác" && otherDresscodeText.trim()) {
      return `💡 Khác: ${otherDresscodeText.trim()}`;
    }
    const found = dresscodeOptions.find((d) => d.id === dresscode);
    return found ? found.name : dresscode;
  };

  // Real-time auto-save to localStorage so choices are never lost
  useEffect(() => {
    const finalFood = getFinalFood();
    const combinedActivities = getCombinedActivities();
    const finalDresscode = getFinalDresscode();
    const planResult = {
      recipient,
      sender,
      food: finalFood,
      otherFoodText: food.includes("Khác") ? otherFoodText.trim() : "",
      activities: combinedActivities,
      otherActivityText: isOtherActivitySelected
        ? otherActivityText.trim()
        : "",
      dresscode: finalDresscode,
      otherDresscodeText: dresscode === "Khác" ? otherDresscodeText.trim() : "",
      notes: notes.trim(),
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(
        `na_birthday_plan_${getDateKey()}`,
        JSON.stringify(planResult),
      );
      localStorage.setItem(
        "na_birthday_plan_preview",
        JSON.stringify(planResult),
      );
    } catch (e) {}
  }, [
    food,
    otherFoodText,
    activities,
    isOtherActivitySelected,
    otherActivityText,
    dresscode,
    otherDresscodeText,
    notes,
    sender,
    recipient,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSealing(true);

    const finalFood = getFinalFood();
    const combinedActivities = getCombinedActivities();
    const finalDresscode = getFinalDresscode();
    const timestamp = Date.now();

    const planResult = {
      recipient,
      sender,
      food: finalFood,
      otherFoodText: food.includes("Khác") ? otherFoodText.trim() : "",
      activities: combinedActivities,
      otherActivityText: isOtherActivitySelected
        ? otherActivityText.trim()
        : "",
      dresscode: finalDresscode,
      otherDresscodeText: dresscode === "Khác" ? otherDresscodeText.trim() : "",
      notes: notes.trim(),
      timestamp,
    };

    try {
      localStorage.setItem(
        `na_birthday_plan_${getDateKey()}`,
        JSON.stringify(planResult),
      );
      localStorage.setItem(
        "na_birthday_plan_preview",
        JSON.stringify(planResult),
      );
    } catch (e) {}



    setTimeout(() => {
      triggerHeartsBurst();
      setIsSubmitted(true);
    }, 200);

    setTimeout(() => {
      setIsSealing(false);
    }, 700);
  };

  const foodOptions = [
    "🥩 Đồ Âu",
    "🥢 Đồ Hàn",
    "🍣 Đồ Nhật",
    "🔥 Buffet lẩu/nướng",
    "✨ Khác (Nhập món riêng em thích)",
  ];

  const activityOptions = [
    "🌃 Lượn lờ ngắm phố phường Sài Gòn",
    "📸 Đi chụp ảnh",
    "🍿 Chui vào rạp xem phim",
  ];

  const dresscodeOptions = [
    {
      id: "Trắng",
      name: "Trắng",
      bg: "#ffffff",
      text: "#111",
      border: "1px solid #ccc",
    },
    {
      id: "Đen",
      name: "Đen",
      bg: "#151515",
      text: "#fff",
      border: "1px solid #ffd670",
    },
    {
      id: "Hồng Pastel",
      name: "Hồng Pastel",
      bg: "#ffc0cb",
      text: "#4a1525",
      border: "1px solid #ff758c",
    },
    {
      id: "Xanh Biển",
      name: "Xanh Biển",
      bg: "#1e88e5",
      text: "#fff",
      border: "1px solid #1e88e5",
    },
    {
      id: "XanhMint",
      name: "Xanh Mint",
      bg: "#98FF98",
      text: "#1a4a25",
      border: "1px solid #98FF98",
    },
    {
      id: "Tùy ban tổ chức",
      name: "Tùy ban tổ chức, em sao cũng được",
      isSpecial: true,
      bg: "linear-gradient(135deg, #e2b857, #ff758c)",
      text: "#fff",
      border: "1px solid #e2b857",
    },
    {
      id: "Khác",
      name: "Ý kiến khác (Nhập màu riêng)",
      isOther: true,
      bg: "rgba(255,255,255,0.08)",
      text: "#fff",
      border: "1.5px dashed var(--accent-gold)",
    },
  ];

  const totalSlides = 4;

  return (
    <div
      className="animate-reveal hide-scrollbar"
      style={{
        width: "100%",
        maxWidth: "520px",
        padding: isSubmitted ? "32px 24px" : "28px 22px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        position: "relative",
        animation: "float-up-intro 0.6s ease",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        border: "1.5px solid var(--accent-gold)",
        borderRadius: "24px",
        background: "rgba(22, 12, 34, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255,255,255,0.1)",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {/* Sealing transition flash overlay */}
      {isSealing && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            zIndex: 200,
            animation: "sealing-flash 0.7s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Romantic heart burst */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="burst-heart"
          style={
            {
              "--tx": h.tx,
              "--ty": h.ty,
              "--scale": h.scale,
              "--rot": h.rot,
              position: "absolute",
              color: "var(--accent-rose)",
              fontSize: "26px",
              pointerEvents: "none",
              zIndex: 300,
            } as any
          }
        >
          {h.char}
        </span>
      ))}

      {isSubmitted ? (
        /* Summary / Confirmation View */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              animation: "heartbeat-survey 1.5s infinite ease-in-out",
            }}
          >
            🎂
          </div>

          <h3
            style={{
              fontSize: "32px",
              fontWeight: "normal",
              fontFamily: "var(--font-cursive)",
              color: "var(--accent-gold)",
              margin: 0,
            }}
          >
            Lịch Trình Đã Được Chốt! 🎉
          </h3>

          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: "1.6",
              maxWidth: "380px",
            }}
          >
            Cảm ơn <strong>{recipient}</strong> đã lên kế hoạch tuyệt vời cho
            ngày đặc biệt. {sender} đã ghi nhận và chuẩn bị mọi thứ chu đáo
            nhất! ❤️
          </p>

          <div
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <div>
              <span style={{ color: "var(--accent-rose)", fontWeight: "bold" }}>
                🍲 Món Ăn:{" "}
              </span>
              <span style={{ color: "#fff" }}>{getFinalFood()}</span>
            </div>
            <div>
              <span
                style={{ color: "var(--accent-purple)", fontWeight: "bold" }}
              >
                🛵 Hoạt Động:{" "}
              </span>
              <span style={{ color: "#fff" }}>
                {getCombinedActivities().join(" • ")}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>
                👗 Dresscode:{" "}
              </span>
              <span style={{ color: "#fff" }}>{getFinalDresscode()}</span>
            </div>
            {notes && (
              <div>
                <span
                  style={{ color: "var(--text-muted)", fontWeight: "bold" }}
                >
                  💌 Dặn dò:{" "}
                </span>
                <span style={{ color: "#fff", fontStyle: "italic" }}>
                  "{notes}"
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              maxWidth: "260px",
              marginTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={onComplete}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "30px",
                backgroundColor: "var(--accent-rose)",
                backgroundImage: "linear-gradient(135deg, #ff4b72, #d9264c)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(255, 75, 114, 0.4)",
                transition: "all 0.2s",
              }}
            >
              Tiếp Tục 💖
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setCurrentSlide(0);
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "var(--text-muted)",
                padding: "10px",
                borderRadius: "20px",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Sửa Lại Lựa Chọn ↩
            </button>
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              opacity: 0.7,
              marginTop: "8px",
            }}
          >
            Được thiết kế và build bằng tất cả tình yêu dành cho Na ❤️
          </div>
        </div>
      ) : (
        /* Slide Wizard Form View */
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          {/* Header & Slide Progress Bar */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--accent-gold)",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                🎂 Birthday Date Planning
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--accent-rose)",
                  fontWeight: "bold",
                  background: "rgba(255, 75, 114, 0.12)",
                  padding: "2px 10px",
                  borderRadius: "12px",
                }}
              >
                Câu {currentSlide + 1} / {totalSlides}
              </span>
            </div>

            {/* Slide Progress Indicator Line */}
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "2px",
                overflow: "hidden",
                display: "flex",
              }}
            >
              {[0, 1, 2, 3].map((stepIdx) => (
                <div
                  key={stepIdx}
                  style={{
                    flex: 1,
                    height: "100%",
                    background:
                      stepIdx <= currentSlide
                        ? "linear-gradient(90deg, #ff4b72, #e2b857)"
                        : "transparent",
                    transition: "background 0.3s ease",
                    borderRight:
                      stepIdx < 3 ? "2px solid rgba(22, 12, 34, 0.95)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* SLIDE 0: CARD 1 - FOOD (Single Choice with 5 Options) */}
          {currentSlide === 0 && (
            <div
              className="animate-reveal"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "20px 18px",
                }}
              >
                <label
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#fff",
                    display: "block",
                    marginBottom: "4px",
                    lineHeight: "1.4",
                  }}
                >
                  1. Mở bát bằng món gì đây ta? 🍲
                </label>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  (Chọn 1 đáp án em thích nhất)
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "10px",
                  }}
                >
                  {foodOptions.map((opt) => {
                    const isSelected = food === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFood(opt);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 18px",
                          borderRadius: "14px",
                          background: isSelected
                            ? "rgba(255, 75, 114, 0.15)"
                            : "rgba(255, 255, 255, 0.03)",
                          border: isSelected
                            ? "1.5px solid var(--accent-rose)"
                            : "1px solid rgba(255, 255, 255, 0.08)",
                          color: isSelected ? "#fff" : "var(--text-muted)",
                          fontSize: "14px",
                          fontWeight: isSelected ? "bold" : "normal",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected
                            ? "0 4px 18px rgba(255, 75, 114, 0.2)"
                            : "none",
                        }}
                      >
                        <span>{opt}</span>
                        <span
                          style={{
                            fontSize: "15px",
                            color: isSelected
                              ? "var(--accent-rose)"
                              : "transparent",
                            fontWeight: "bold",
                          }}
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}

                  {/* OTHER FOOD INPUT FIELD */}
                  {food === "✨ Khác (Nhập món riêng em thích)" && (
                    <input
                      type="text"
                      value={otherFoodText}
                      onChange={(e) => setOtherFoodText(e.target.value)}
                      placeholder="Nhập món ăn/quán ăn em muốn..."
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        background: "rgba(0, 0, 0, 0.35)",
                        border: "1px solid var(--accent-rose)",
                        color: "#fff",
                        fontSize: "13.5px",
                        outline: "none",
                        boxSizing: "border-box",
                        marginTop: "2px",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "24px",
                    backgroundColor: "var(--accent-rose)",
                    backgroundImage:
                      "linear-gradient(135deg, #ff4b72, #d9264c)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(255, 75, 114, 0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  <span>Tiếp theo</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 1: CARD 2 - ACTIVITIES (Multiple Choice + Other Option) */}
          {currentSlide === 1 && (
            <div
              className="animate-reveal"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "20px 18px",
                }}
              >
                <label
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#fff",
                    display: "block",
                    marginBottom: "4px",
                    lineHeight: "1.4",
                  }}
                >
                  2. Ăn no rồi mình đi đâu tiếp? 🛵
                </label>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  (Có thể chọn nhiều đáp án)
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {activityOptions.map((act) => {
                    const isChecked = activities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => toggleActivity(act)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "14px 18px",
                          borderRadius: "14px",
                          background: isChecked
                            ? "rgba(156, 108, 250, 0.15)"
                            : "rgba(255, 255, 255, 0.03)",
                          border: isChecked
                            ? "1.5px solid var(--accent-purple)"
                            : "1px solid rgba(255, 255, 255, 0.08)",
                          color: isChecked ? "#fff" : "var(--text-muted)",
                          fontSize: "14px",
                          fontWeight: isChecked ? "bold" : "normal",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                          boxShadow: isChecked
                            ? "0 4px 18px rgba(156, 108, 250, 0.2)"
                            : "none",
                        }}
                      >
                        <span
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "5px",
                            border: isChecked
                              ? "1.5px solid var(--accent-purple)"
                              : "1.5px solid rgba(255,255,255,0.3)",
                            background: isChecked
                              ? "var(--accent-purple)"
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "12px",
                            flexShrink: 0,
                            fontWeight: "bold",
                          }}
                        >
                          {isChecked ? "✓" : ""}
                        </span>
                        <span>{act}</span>
                      </button>
                    );
                  })}

                  {/* OTHER OPTION */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsOtherActivitySelected(!isOtherActivitySelected)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: isOtherActivitySelected
                        ? "rgba(156, 108, 250, 0.15)"
                        : "rgba(255, 255, 255, 0.03)",
                      border: isOtherActivitySelected
                        ? "1.5px solid var(--accent-purple)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      color: isOtherActivitySelected
                        ? "#fff"
                        : "var(--text-muted)",
                      fontSize: "14px",
                      fontWeight: isOtherActivitySelected ? "bold" : "normal",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      boxShadow: isOtherActivitySelected
                        ? "0 4px 18px rgba(156, 108, 250, 0.2)"
                        : "none",
                    }}
                  >
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        border: isOtherActivitySelected
                          ? "1.5px solid var(--accent-purple)"
                          : "1.5px solid rgba(255,255,255,0.3)",
                        background: isOtherActivitySelected
                          ? "var(--accent-purple)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "12px",
                        flexShrink: 0,
                        fontWeight: "bold",
                      }}
                    >
                      {isOtherActivitySelected ? "✓" : ""}
                    </span>
                    <span>✨ Khác (Nhập ý kiến riêng em thích)</span>
                  </button>

                  {/* OTHER INPUT FIELD */}
                  {isOtherActivitySelected && (
                    <input
                      type="text"
                      value={otherActivityText}
                      onChange={(e) => setOtherActivityText(e.target.value)}
                      placeholder="Nhập địa điểm/hoạt động em muốn..."
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        background: "rgba(0, 0, 0, 0.35)",
                        border: "1px solid var(--accent-purple)",
                        color: "#fff",
                        fontSize: "13.5px",
                        outline: "none",
                        boxSizing: "border-box",
                        marginTop: "2px",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setCurrentSlide(0)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ← Quay lại
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentSlide(2)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "24px",
                    backgroundColor: "var(--accent-rose)",
                    backgroundImage:
                      "linear-gradient(135deg, #ff4b72, #d9264c)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(255, 75, 114, 0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  <span>Tiếp theo</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 2: CARD 3 - DRESSCODE (Visual Color Selection Swatches + Other Input) */}
          {currentSlide === 2 && (
            <div
              className="animate-reveal"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "20px 18px",
                }}
              >
                <label
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#fff",
                    display: "block",
                    marginBottom: "16px",
                    lineHeight: "1.4",
                  }}
                >
                  3. Khách mời hôm đó tính mặc tone màu gì? 👗
                </label>

                {/* Color Swatch Circles */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "12px 0 16px 0",
                  }}
                >
                  {dresscodeOptions.map((item) => {
                    const isSelected = dresscode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDresscode(item.id)}
                        title={item.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: item.bg,
                          border: item.border,
                          boxShadow: isSelected
                            ? "0 0 20px rgba(226, 184, 87, 0.7), 0 0 0 3px var(--accent-gold)"
                            : "0 4px 12px rgba(0,0,0,0.3)",
                          transform: isSelected ? "scale(1.15)" : "scale(1)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.text,
                          fontWeight: "bold",
                          fontSize: item.isSpecial
                            ? "18px"
                            : item.isOther
                              ? "16px"
                              : "14px",
                          transition:
                            "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          outline: "none",
                        }}
                      >
                        {item.isSpecial
                          ? "?"
                          : item.isOther
                            ? "✏️"
                            : isSelected
                              ? "✓"
                              : ""}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Swatch Name Display */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "4px",
                    fontSize: "13px",
                    color: "var(--accent-gold)",
                    fontWeight: 600,
                  }}
                >
                  Đã chọn:{" "}
                  <span style={{ color: "#fff" }}>
                    {dresscodeOptions.find((d) => d.id === dresscode)?.name}
                  </span>
                </div>

                {/* OTHER DRESSCODE INPUT FIELD */}
                {dresscode === "Khác" && (
                  <input
                    type="text"
                    value={otherDresscodeText}
                    onChange={(e) => setOtherDresscodeText(e.target.value)}
                    placeholder="Nhập màu tone dresscode em muốn mặc..."
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(0, 0, 0, 0.35)",
                      border: "1px solid var(--accent-gold)",
                      color: "#fff",
                      fontSize: "13.5px",
                      outline: "none",
                      boxSizing: "border-box",
                      marginTop: "12px",
                    }}
                  />
                )}
              </div>

              {/* Navigation Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ← Quay lại
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentSlide(3)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "24px",
                    backgroundColor: "var(--accent-rose)",
                    backgroundImage:
                      "linear-gradient(135deg, #ff4b72, #d9264c)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(255, 75, 114, 0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  <span>Tiếp theo</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 3: CARD 4 - NOTES & SUBMIT */}
          {currentSlide === 3 && (
            <div
              className="animate-reveal"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "20px 18px",
                }}
              >
                <label
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#fff",
                    display: "block",
                    marginBottom: "10px",
                    lineHeight: "1.4",
                  }}
                >
                  4. Có dặn dò gì thêm cho Ban tổ chức không? 💌
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Nhớ mua hoa, nhớ đến đón đúng giờ..."
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    fontSize: "13.5px",
                    padding: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent-rose)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")
                  }
                />
              </div>

              {/* Navigation & Submit Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentSlide(2)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    ← Quay lại
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: "30px",
                    backgroundColor: "var(--accent-rose)",
                    backgroundImage:
                      "linear-gradient(135deg, #ff4b72, #d9264c)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(255, 75, 114, 0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(255, 75, 114, 0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(255, 75, 114, 0.4)";
                  }}
                >
                  Chốt lịch trình! Đợi nhé 🎉
                </button>

                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    opacity: 0.75,
                    textAlign: "center",
                    marginTop: "2px",
                  }}
                >
                  Được thiết kế và build bằng tất cả tình yêu dành cho Na ❤️
                </span>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
