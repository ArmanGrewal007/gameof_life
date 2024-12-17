import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export function PlayPauseButton({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={twMerge(
        "transition ease-in flex items-center justify-center h-8 w-8 rounded-full shadow-md",
        isPlaying
          ? "bg-orange-500 hover:bg-orange-700 text-white"
          : "bg-emerald-500 hover:bg-emerald-700 text-white",
      )}
      onClick={onClick}
    >
      {isPlaying ? (
        <BsFillPauseFill className="h-6 w-6" />
      ) : (
        <BsFillPlayFill className="h-6 w-6" />
      )}
    </button>
  );
}
