import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import h1 from "../../assets/photo_result.svg";

const PAGE_BG = "#f5f4ee";
const PRIMARY = "#4050d6";
const WHITE = "#ffffff";
const PREVIEW_BG = "#f1f2fb";

type ResultState = {
  shotCount?: number;
  frameTitle?: string;
  photos?: string[];
};

type Slot = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function getViewportAspectRatio() {
  if (typeof window === "undefined") {
    return 16 / 9;
  }

  const ratio = window.innerWidth / window.innerHeight;
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
}

function getFrameAspectRatio(shotCount: number) {
  return shotCount === 3 ? 1.72 : 0.62;
}

function generateRandomCode() {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  const numbers = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 10).toString()
  ).join("");

  return `${letters}${numbers}`;
}

function getSlots(shotCount: number): Slot[] {
  if (shotCount === 3) {
    return [
      { left: 0, top: 31, width: 33.34, height: 30 },
      { left: 33.33, top: 31, width: 33.34, height: 30 },
      { left: 66.66, top: 31, width: 33.34, height: 30 },
    ];
  }

  if (shotCount === 4) {
    return [
      { left: 16, top: 10, width: 68, height: 14 },
      { left: 16, top: 33, width: 68, height: 14 },
      { left: 16, top: 56, width: 68, height: 14 },
      { left: 16, top: 79, width: 68, height: 14 },
    ];
  }

  return [
    { left: 22, top: 8.5, width: 56, height: 37 },
    { left: 22, top: 54.5, width: 56, height: 37 },
  ];
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function fitSlotToAspect(
  slot: Slot,
  targetAspect: number,
  shotCount: number
): Slot {
  if (shotCount === 3) {
    return slot;
  }

  if (shotCount === 4) {
    const enlargedHeight = slot.height * 1.62;
    const offsetTop = (slot.height - enlargedHeight) / 2;

    return {
      ...slot,
      top: slot.top + offsetTop,
      height: enlargedHeight,
    };
  }

  const enlargedHeight = slot.height * 1.25;
  const nextWidth = enlargedHeight * targetAspect;
  const offsetLeft = (slot.width - nextWidth) / 2;
  const offsetTop = (slot.height - enlargedHeight) / 2;

  return {
    ...slot,
    left: slot.left + offsetLeft,
    top: slot.top + offsetTop,
    width: nextWidth,
    height: enlargedHeight,
  };
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
    image.src = src;
  });
}

async function buildTransparentResultImage(photos: string[], shotCount: number) {
  const canvas = document.createElement("canvas");
  canvas.width = shotCount === 3 ? 1800 : 1200;
  canvas.height = shotCount === 3 ? 1100 : 1600;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("결과 이미지를 만들 수 없어요.");
  }

  const outerX = shotCount === 3 ? 120 : 180;
  const outerY = shotCount === 3 ? 150 : 110;
  const outerWidth = shotCount === 3 ? 1560 : 840;
  const outerHeight = shotCount === 3 ? 800 : 1380;
  const innerX = shotCount === 3 ? 220 : 300;
  const innerY = shotCount === 3 ? 245 : 200;
  const innerWidth = shotCount === 3 ? 1360 : 600;
  const innerHeight = shotCount === 3 ? 610 : 1080;
  const viewportAspect = getViewportAspectRatio();
  const slots = getSlots(shotCount).map((slot) =>
    fitSlotToAspect(slot, viewportAspect, shotCount)
  );

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.save();
  context.strokeStyle = "rgba(64,80,214,0.65)";
  context.lineWidth = 7;
  roundedRect(context, outerX, outerY, outerWidth, outerHeight, 54);
  context.stroke();

  context.strokeStyle = "rgba(64,80,214,0.22)";
  context.lineWidth = 5;
  roundedRect(context, innerX, innerY, innerWidth, innerHeight, 42);
  context.stroke();
  context.restore();

  for (let index = 0; index < slots.length; index += 1) {
    const photo = photos[index];
    if (!photo) continue;

    const slot = slots[index];
    const image = await loadImage(photo);

    const x = innerX + (slot.left / 100) * innerWidth;
    const y = innerY + (slot.top / 100) * innerHeight;
    const w = (slot.width / 100) * innerWidth;
    const h = (slot.height / 100) * innerHeight;
    const radius = shotCount === 3 ? 0 : shotCount === 4 ? 32 : 44;

    context.save();
    roundedRect(context, x, y, w, h, radius);
    context.clip();

    const baseRatio = Math.max(w / image.width, h / image.height);
    const ratio = shotCount === 3 ? baseRatio * 1.18 : baseRatio * 1.06;
    const drawWidth = image.width * ratio;
    const drawHeight = image.height * ratio;
    const drawX = x + (w - drawWidth) / 2;
    const drawY = y + (h - drawHeight) / 2;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    context.restore();
  }

  return canvas.toDataURL("image/png");
}

function FramePreview({
  shotCount,
  photos,
}: {
  shotCount: number;
  photos: string[];
}) {
  const viewportAspect = getViewportAspectRatio();
  const frameAspectRatio = getFrameAspectRatio(shotCount);
  const slots = getSlots(shotCount).map((slot) =>
    fitSlotToAspect(slot, viewportAspect, shotCount)
  );

  return (
    <div
      style={{
        width: shotCount === 3 ? "min(88vw, 980px)" : "min(78vw, 520px)",
        aspectRatio: `${frameAspectRatio}`,
        border: "3px solid rgba(64,80,214,0.65)",
        borderRadius: 34,
        padding: "22px",
        boxSizing: "border-box",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "2px solid rgba(64,80,214,0.2)",
          borderRadius: 28,
          position: "relative",
          background: "transparent",
        }}
      >
        {slots.map((slot, index) => (
          <div
            key={`${slot.left}-${slot.top}-${index}`}
            style={{
              position: "absolute",
              left: `${slot.left}%`,
              top: `${slot.top}%`,
              width: `${slot.width}%`,
              height: `${slot.height}%`,
              borderRadius: shotCount === 3 ? 0 : shotCount === 4 ? 18 : 24,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: PREVIEW_BG,
              border: shotCount === 3 ? "none" : "2px dashed rgba(64,80,214,0.35)",
              boxSizing: "border-box",
            }}
          >
            {photos[index] ? (
              <img
                src={photos[index]}
                alt={`${index + 1}번째 컷 결과`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: shotCount === 3 ? "cover" : "contain",
                  objectPosition: shotCount === 3 ? "center center" : "center",
                  transform: shotCount === 3 ? "scale(1.18)" : "scale(1.06)",
                  transformOrigin: "center center",
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoResult() {
  const location = useLocation();
  const state = (location.state ?? {}) as ResultState;
  const stored = sessionStorage.getItem("photoResultData");
  const storedState = stored ? (JSON.parse(stored) as ResultState) : null;

  const shotCount = state.shotCount ?? storedState?.shotCount ?? 2;
  const frameTitle = state.frameTitle ?? storedState?.frameTitle ?? `${shotCount}컷`;
  const photos = state.photos ?? storedState?.photos ?? [];

  const [shareCode, setShareCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState("");

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

  useEffect(() => {
    let cancelled = false;

    const buildResult = async () => {
      if (!photos.length) return;

      try {
        const result = await buildTransparentResultImage(photos, shotCount);
        if (!cancelled) {
          setFinalImageUrl(result);
        }
      } catch (error) {
        console.error("결과 이미지 생성 실패:", error);
      }
    };

    buildResult();

    return () => {
      cancelled = true;
    };
  }, [photos, shotCount]);

  const savePayload = useMemo(
    () => ({
      userId,
      message: savedMessage,
      shareCode,
      frameTitle,
      shotCount,
      photos,
      finalImageUrl,
    }),
    [userId, savedMessage, shareCode, frameTitle, shotCount, photos, finalImageUrl]
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
    if (!finalImageUrl) {
      window.alert("아직 결과 이미지를 만드는 중이에요. 잠시 후 다시 시도해주세요.");
      return;
    }

    const link = document.createElement("a");
    link.href = finalImageUrl;
    link.download = `framie-${shareCode || "photo"}.png`;
    link.click();

    console.log("추후 DB 저장 payload", savePayload);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAGE_BG,
        display: "grid",
        gridTemplateColumns:
          shotCount === 3
            ? "minmax(760px, 1fr) minmax(320px, 570px)"
            : "minmax(0, 1fr) minmax(320px, 570px)",
      }}
    >
      <section
        style={{
          background: PAGE_BG,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          boxSizing: "border-box",
        }}
      >
        {photos.length > 0 ? (
          <FramePreview shotCount={shotCount} photos={photos} />
        ) : (
          <div
            style={{
              width: shotCount === 3 ? "min(88vw, 980px)" : "min(78vw, 520px)",
              aspectRatio: `${getFrameAspectRatio(shotCount)}`,
              border: "2px dashed rgba(64,80,214,0.28)",
              borderRadius: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PRIMARY,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            아직 촬영된 사진이 없어요
          </div>
        )}
      </section>

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

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 400,
                opacity: 0.95,
              }}
            >
              프레임 : {frameTitle}
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
              투명 PNG 저장하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}