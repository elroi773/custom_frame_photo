import { useEffect, useMemo, useState } from "react";
import h1 from "../../assets/photo_result.svg";

const PAGE_BG = "#f5f4ee";
const PRIMARY = "#4050d6";
const WHITE = "#ffffff";

function generateRandomCode() {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  const numbers = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 10).toString()
  ).join("");

  return `${letters}${numbers}`;
}

export default function PhotoResult() {
  const [shareCode, setShareCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const userId = "userID";
  const savedMessage = "하이루~~ 보고 싶어~~";

  useEffect(() => {
    setShareCode(generateRandomCode());
  }, []);

  useEffect(() => {
    if (!isCopied) return;

    const timer = window.setTimeout(() => {
      setIsCopied(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const savePayload = useMemo(
    () => ({
      userId,
      message: savedMessage,
      shareCode,
    }),
    [userId, savedMessage, shareCode]
  );

  const handleGenerateCode = () => {
    setShareCode(generateRandomCode());
    setIsCopied(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setIsCopied(true);
    } catch (error) {
      console.error("코드 복사 실패:", error);
      window.alert("코드 복사에 실패했어요. 다시 시도해주세요.");
    }
  };

  const handleSave = () => {
    console.log("추후 DB 저장 payload", savePayload);
    window.alert("나중에 DB 저장이 연결될 자리예요.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAGE_BG,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 570px)",
      }}
    >
      <section
        style={{
          background: PAGE_BG,
          minHeight: "100vh",
        }}
      />

      <section
        style={{
          background: PRIMARY,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(28px, 5vw, 56px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <img
            src={h1}
            alt="결과물 확인"
            style={{
              width: "min(290px, 100%)",
              display: "block",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              color: WHITE,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 400,
                opacity: 0.95,
              }}
            >
              제작 : {userId}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 400,
                opacity: 0.95,
              }}
            >
              메시지 : {savedMessage}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 400,
                  opacity: 0.95,
                }}
              >
                코드 : {shareCode}
              </p>

              <button
                type="button"
                onClick={handleGenerateCode}
                style={{
                  border: "1.5px solid rgba(255,255,255,0.85)",
                  borderRadius: "999px",
                  background: "transparent",
                  color: WHITE,
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                새 코드 생성
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                width: "100%",
                height: "72px",
                borderRadius: "10px",
                border: "none",
                background: WHITE,
                color: PRIMARY,
                fontSize: "18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isCopied ? "코드 복사 완료" : "공유하기"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              style={{
                width: "100%",
                height: "72px",
                borderRadius: "10px",
                border: "2px solid rgba(255,255,255,0.9)",
                background: "transparent",
                color: WHITE,
                fontSize: "18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}