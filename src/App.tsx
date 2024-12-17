import { useRef, useState } from "react";
import { createEmtpyGrid, ROWS, COLS } from "./utils/utils";
import { twMerge } from "tailwind-merge";
import { PlayPauseButton } from "./components/PlayPauseButton";

function App() {
  const [grid] = useState<number[][]>(createEmtpyGrid());
  const [isPlaying, setIsPlaying] = useState(false);

  // Because we are using setInterval, we need to use useRef to keep track of the current value
  // and not take the outdated values
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-4 h-screen w-screen">
        <h1 className="text-4xl font-bold my-5">Conway's game of life</h1>
        <div className="flex gap-4 items-center">
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying) {
                playingRef.current = true;
                // run simulation
              }
            }}
          />
        </div>
        {/*
      Tailwind generates all the classes at buildtime, so all the utility classes are 
      predefined and you cannot accomoddate dynamic values, so we didn't define the following
      CSS in classNames, because we cannot pass dynamic values to Tailwind classes.
       */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 20px)`,
            gridTemplateRows: `repeat(${ROWS}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((_col, j) => (
              <button
                key={`${i}-${j}`}
                className={twMerge(
                  "border border-[#ccc]",
                  grid[i][j] ? "bg-black" : "bg-white", // Alive or not (truthy or falsy)
                )}
              >
                {/* ({i}, {j}) */}
              </button>
            )),
          )}
        </div>
      </div>
    </>
  );
}

export default App;
