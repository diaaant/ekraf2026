import QRCode from "qrcode";

export default function useQrCode() {
  async function generate(text) {
    return QRCode.toDataURL(text, {
      width: 320,
      margin: 1,
      color: { dark: "#2a1d15", light: "#fffaf0" },
    });
  }

  return { generate };
}
