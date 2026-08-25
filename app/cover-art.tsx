const labels = ["EVENING WALK", "BLUE STUDY", "PIXEL VOYAGE", "RAIN PLAYLIST", "SUMMER NIGHT", "DRAWING NOTES"];

export default function CoverArt({ index, symbol }: { index: number; symbol: string }) {
  return (
    <div className={`cover-art scene-${index + 1}`} aria-hidden="true">
      <span className="scene-glow" />
      <span className="scene-back" />
      <span className="scene-main" />
      <span className="scene-detail" />
      <span className="scene-mark">{symbol}</span>
      <span className="scene-label">{labels[index]}</span>
    </div>
  );
}
