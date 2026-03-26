import { useEffect, useState } from "react";
import h1 from "../../assets/Mypage.svg";

import { supabase } from "../../lib/supabase";

const PAGE_BG = "#f5f4ee";
const PRIMARY = "#4050d6";
const CARD_BG = "#ffffff";
const MUTED = "#8b8b95";

export default function Mypage() {
  const [activeTab, setActiveTab] = useState<"myframe" | "photos">("myframe");
  const [userId, setUserId] = useState("로그인 정보 없음");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (error || !user) {
        setUserId("로그인 정보 없음");
        setIsLoadingUser(false);
        return;
      }

      const displayId =
        user.user_metadata?.nickname ||
        user.user_metadata?.name ||
        user.email ||
        user.id;

      setUserId(`@${displayId}`);
      setIsLoadingUser(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;

      if (!currentUser) {
        setUserId("로그인 정보 없음");
        setIsLoadingUser(false);
        return;
      }

      const displayId =
        currentUser.user_metadata?.nickname ||
        currentUser.user_metadata?.name ||
        currentUser.email ||
        currentUser.id;

      setUserId(`@${displayId}`);
      setIsLoadingUser(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const cards =
    activeTab === "myframe"
      ? [
          { title: "Summer Mood", subtitle: "Recently edited" },
          { title: "Blue Ribbon", subtitle: "Saved frame" },
          { title: "Soft Cloud", subtitle: "Favorite preset" },
          { title: "Classic Film", subtitle: "Last used" },
        ]
      : [
          { title: "04 Mar 2026", subtitle: "3 photos saved" },
          { title: "28 Feb 2026", subtitle: "2 photos saved" },
          { title: "21 Feb 2026", subtitle: "4 photos saved" },
          { title: "14 Feb 2026", subtitle: "1 photo saved" },
        ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAGE_BG,
        padding: "clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px) 48px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <header
          style={{
            background: CARD_BG,
            borderRadius: "28px",
            padding: "28px 24px 22px",
            boxShadow: "0 12px 30px rgba(24, 36, 84, 0.08)",
            gridColumn: "span 1",
          }}
        >
          <img
            src={h1}
            alt="Mypage"
            className="mypage-title"
            style={{
              width: "min(220px, 70%)",
              display: "block",
              margin: "0 auto 20px",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: MUTED,
                  letterSpacing: "0.04em",
                }}
              >
                ID
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: PRIMARY,
                  wordBreak: "break-all",
                }}
              >
                {isLoadingUser ? "불러오는 중..." : userId}
              </p>
            </div>

            <div
              style={{
                minWidth: "88px",
                height: "88px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #e8ebff 0%, #dfe3ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PRIMARY,
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "inset 0 0 0 1px rgba(64, 80, 214, 0.08)",
              }}
            >
              PROFILE
            </div>
          </div>
        </header>

        <section
          style={{
            background: CARD_BG,
            borderRadius: "28px",
            padding: "14px",
            boxShadow: "0 12px 30px rgba(24, 36, 84, 0.08)",
            gridColumn: "span 1",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              background: "#eef0fb",
              borderRadius: "20px",
              padding: "6px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("myframe")}
              style={{
                height: "52px",
                border: "none",
                borderRadius: "16px",
                background: activeTab === "myframe" ? PRIMARY : "transparent",
                color: activeTab === "myframe" ? "#ffffff" : PRIMARY,
                fontSize: "17px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              My frame
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              style={{
                height: "52px",
                border: "none",
                borderRadius: "16px",
                background: activeTab === "photos" ? PRIMARY : "transparent",
                color: activeTab === "photos" ? "#ffffff" : PRIMARY,
                fontSize: "17px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Photos
            </button>
          </div>
        </section>

        <section
          style={{
            background: CARD_BG,
            borderRadius: "28px",
            padding: "22px 18px 18px",
            boxShadow: "0 12px 30px rgba(24, 36, 84, 0.08)",
            gridColumn: "1 / -1",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  color: "#1f2552",
                }}
              >
                {activeTab === "myframe" ? "Saved frames" : "Recent photos"}
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  color: MUTED,
                }}
              >
                {activeTab === "myframe"
                  ? "Your favorite frame styles in one place"
                  : "Moments you captured with Framie"}
              </p>
            </div>

            <div
              style={{
                minWidth: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "#eef0fb",
                color: PRIMARY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {cards.length}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {cards.map((item) => (
              <button
                key={item.title}
                type="button"
                style={{
                  border: "none",
                  background: "#f8f9ff",
                  borderRadius: "22px",
                  padding: "16px",
                  textAlign: "left",
                  cursor: "pointer",
                  boxShadow: "inset 0 0 0 1px rgba(64, 80, 214, 0.08)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "18px",
                    background:
                      activeTab === "myframe"
                        ? "linear-gradient(135deg, #cfd6ff 0%, #e8ebff 100%)"
                        : "linear-gradient(135deg, #d8defd 0%, #f0f3ff 100%)",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: PRIMARY,
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                  }}
                >
                  {activeTab === "myframe" ? "FRAME" : "PHOTO"}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#20275c",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "12px",
                    color: MUTED,
                  }}
                >
                  {item.subtitle}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}