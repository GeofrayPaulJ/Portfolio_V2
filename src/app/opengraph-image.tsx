import { ImageResponse } from "next/og";

export const alt = "Geofray Paul J, AI engineer in medical imaging";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0c10",
          color: "#f4f4f5",
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>Geofray Paul J</div>
        <div style={{ fontSize: 40, color: "#0ea5e9", marginTop: 16 }}>
          AI Engineer · Medical Imaging &amp; MLOps
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 40, lineHeight: 1.4 }}>
          Segmentation and classification · computational pathology, computational radiology and neuroimaging ·
          MICCAI 2026 challenge entries
        </div>
        <div style={{ fontSize: 24, color: "#71717a", marginTop: 48 }}>geofraypaul.vercel.app</div>
      </div>
    ),
    { ...size }
  );
}
