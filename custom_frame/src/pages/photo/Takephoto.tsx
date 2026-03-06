import { useEffect, useMemo, useRef, useState } from "react";
import h1 from "../../assets/frame_photo.svg";
import { useLocation, useNavigate } from "react-router-dom";

export default function TakePhoto() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const shotCount = Number(location.state?.shotCount) || 2;
  const frameTitle = location.state?.frameTitle || `${shotCount}컷`;
  const [error, setError] = useState<string>("");
  const [currentShotIndex, setCurrentShotIndex] = useState(0);

  const shotSlots = useMemo(() => Array.from({ length: shotCount }, (_, index) => index), [shotCount]);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        // Prefer rear camera on mobile; browsers will pick the best available.
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // iOS Safari sometimes needs an explicit play call.
          await videoRef.current.play().catch(() => {
            /* ignore - user gesture may be required */
          });
        }
      } catch (e) {
        setError(
          "카메라 권한을 허용해 주세요. (브라우저/기기에서 카메라 접근이 차단되어 있을 수 있어요.)"
        );
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleNextShot = () => {
    if (currentShotIndex < shotCount - 1) {
      setCurrentShotIndex((prev) => prev + 1);
      return;
    }

    window.alert("실제 사진 저장 기능은 아직 연결 전이에요. 지금은 컷 진행만 확인할 수 있어요.");
  };

  const handleResetShots = () => {
    setCurrentShotIndex(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fbf9f3",
        padding: "56px 24px 64px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Paperozi';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-6SemiBold.woff2') format('woff2');
          font-weight: 600;
          font-display: swap;
        }

        @font-face {
          font-family: 'Paperozi';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2') format('woff2');
          font-weight: 400;
          font-display: swap;
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            color: "#3047d9",
            fontFamily: "Paperozi",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            padding: 0,
            marginBottom: 20,
          }}
        >
          ← 돌아가기
        </button>

        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <img
            src={h1}
            alt="Frame preview"
            className="custom2-previewImg"
            style={{ display: "block", margin: "0 auto" }}
          />

          <p
            style={{
              margin: "14px 0 0",
              fontSize: 20,
              color: "#3047d9",
              fontFamily: "Paperozi",
              fontWeight: 400,
            }}
          >
            {frameTitle} 촬영을 준비하고 있어요
          </p>
        </header>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <section
            aria-label="카메라 미리보기"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#d9d9d9",
              borderRadius: 24,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 16px 40px rgba(48, 71, 217, 0.08)",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: "scaleX(-1)",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.88)",
                color: "#3047d9",
                fontFamily: "Paperozi",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {currentShotIndex + 1} / {shotCount} 컷 진행 중
            </div>
          </section>

          <aside
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1.5px solid rgba(48, 71, 217, 0.14)",
              borderRadius: 28,
              padding: 24,
              boxShadow: "0 12px 30px rgba(48, 71, 217, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Paperozi",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#3047d9",
                }}
              >
                컷 진행 상태
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontFamily: "Paperozi",
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#5b67b8",
                  lineHeight: 1.5,
                }}
              >
                실제 촬영 저장은 아직 연결하지 않았어요. 지금은 선택한 컷 수만큼 흐름만 먼저 확인할 수 있어요.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {shotSlots.map((slotIndex) => {
                const isActive = slotIndex === currentShotIndex;
                const isDone = slotIndex < currentShotIndex;

                return (
                  <div
                    key={slotIndex}
                    style={{
                      borderRadius: 18,
                      padding: "14px 16px",
                      border: isActive
                        ? "2px solid #3047d9"
                        : "1.5px solid rgba(48, 71, 217, 0.16)",
                      background: isDone
                        ? "rgba(48, 71, 217, 0.08)"
                        : isActive
                        ? "rgba(48, 71, 217, 0.05)"
                        : "#ffffff",
                      fontFamily: "Paperozi",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#3047d9",
                          fontSize: 16,
                        }}
                      >
                        {slotIndex + 1}번째 컷
                      </span>
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#6874c8",
                          fontSize: 13,
                        }}
                      >
                        {isDone ? "다음으로 이동 완료" : isActive ? "현재 준비 중" : "대기 중"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                onClick={handleNextShot}
                style={{
                  border: "none",
                  borderRadius: 18,
                  background: "#3047d9",
                  color: "#ffffff",
                  fontFamily: "Paperozi",
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "16px 18px",
                  cursor: "pointer",
                }}
              >
                {currentShotIndex === shotCount - 1 ? "촬영 완료 흐름 보기" : "다음 컷으로 진행"}
              </button>

              <button
                type="button"
                onClick={handleResetShots}
                style={{
                  border: "1.5px solid rgba(48, 71, 217, 0.22)",
                  borderRadius: 18,
                  background: "#ffffff",
                  color: "#3047d9",
                  fontFamily: "Paperozi",
                  fontWeight: 400,
                  fontSize: 15,
                  padding: "14px 18px",
                  cursor: "pointer",
                }}
              >
                처음부터 다시 보기
              </button>
            </div>

            {error ? (
              <p
                role="alert"
                style={{
                  margin: 0,
                  color: "#5b5b5b",
                  fontSize: 14,
                  fontFamily: "Paperozi",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </p>
            ) : null}
          </aside>
        </main>
      </div>
    </div>
  );
}