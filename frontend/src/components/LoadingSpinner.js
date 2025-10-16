export default function LoadingSpinner({ size = "md" }) {
  const px = size === "lg" ? 48 : size === "sm" ? 16 : 24;
  return (
    <div className="spinner" style={{ width: px, height: px }} aria-label="loading" />
  );
}
