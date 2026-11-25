type PlaceholderProps = {
  tone: string;
  ratio: string;
};

export function Placeholder({ tone, ratio }: PlaceholderProps) {
  return (
    <div
      className={`listing-visual listing-visual-${tone}`}
      style={{ aspectRatio: ratio }}
      aria-hidden="true"
    >
      <span className="visual-sun" />
      <span className="visual-architecture" />
    </div>
  );
}
