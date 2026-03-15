import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a73e8",
          borderRadius: "40px",
          position: "relative",
        }}
      >
        {/* Inner ring */}
        <div
          style={{
            width: "112px",
            height: "112px",
            borderRadius: "56px",
            border: "2px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
          }}
        />
        {/* Dollar sign */}
        <span
          style={{
            fontSize: "80px",
            fontWeight: 700,
            color: "white",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          $
        </span>
        {/* Left arrow (send) */}
        <div
          style={{
            position: "absolute",
            left: "14px",
            top: "60px",
            fontSize: "28px",
            color: "#81D4FA",
            display: "flex",
          }}
        >
          &larr;
        </div>
        {/* Right arrow (receive) */}
        <div
          style={{
            position: "absolute",
            right: "14px",
            bottom: "60px",
            fontSize: "28px",
            color: "#A5D6A7",
            display: "flex",
          }}
        >
          &rarr;
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
