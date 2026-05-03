import { Dispatch, SetStateAction } from "react";

export function Switcher({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={() => setIsActive((v) => !v)}
      className={`relative inline-flex h-6.5 w-11.5 shrink-0 items-center rounded-full transition-colors ${isActive ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-5.5" : "translate-x-1"}`}
      />
    </button>
  );
}
