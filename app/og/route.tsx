import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Dimensions for OG image
const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? "Muhammad Daffa Rezky Adyra";
  const description = searchParams.get("description") ?? "TKJ Developer & IoT Enthusiast";
  const category = searchParams.get("category") ?? "";
  const type = searchParams.get("type") ?? "blog"; // "blog" | "page"

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          background: "#0A0A0F",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(0,255,136,0.15)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(0,153,255,0.15)",
            filter: "blur(120px)",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Border frame */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px 72px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Top: Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo badge */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #00FF88, #0099FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                color: "#0A0A0F",
                boxShadow: "0 0 20px rgba(0,255,136,0.4)",
              }}
            >
              DR
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.3px",
              }}
            >
              Daffa Rizky
            </span>

            {/* Category badge */}
            {category && (
              <div
                style={{
                  marginLeft: "auto",
                  padding: "6px 18px",
                  borderRadius: 999,
                  background: "rgba(0,153,255,0.15)",
                  border: "1px solid rgba(0,153,255,0.3)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0099FF",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </div>
            )}
          </div>

          {/* Middle: Title + Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Type label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 3,
                  background: "linear-gradient(90deg, #00FF88, #0099FF)",
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#00FF88",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                {type === "blog" ? "Blog Post" : "Portfolio"}
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 60 ? 44 : 56,
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.15,
                letterSpacing: "-1px",
                maxWidth: 900,
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 22,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5,
                  maxWidth: 800,
                  fontWeight: 400,
                }}
              >
                {description.length > 120
                  ? description.substring(0, 120) + "..."
                  : description}
              </div>
            )}
          </div>

          {/* Bottom: URL + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
              }}
            >
              daffa-portfolio.vercel.app
            </span>

            <div
              style={{
                padding: "12px 28px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #00FF88, #0099FF)",
                fontSize: 16,
                fontWeight: 700,
                color: "#0A0A0F",
                boxShadow: "0 0 20px rgba(0,153,255,0.3)",
              }}
            >
              Baca Selengkapnya →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    }
  );
}
