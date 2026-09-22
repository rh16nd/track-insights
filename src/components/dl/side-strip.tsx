/** The arrow that pages a sideways row (see useSideStrip). */
export function StripArrow({
  dir,
  disabled,
  onPage,
  label,
}: {
  dir: 1 | -1;
  disabled: boolean;
  onPage: (dir: 1 | -1) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onPage(dir)}
      disabled={disabled}
      aria-label={label}
      className="glass inline-flex size-10 items-center justify-center rounded-full text-foreground transition-[opacity,transform] duration-150 ease-out hover:bg-white/15 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px]"
        aria-hidden="true"
      >
        <path d={dir === -1 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
