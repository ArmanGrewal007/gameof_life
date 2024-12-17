import { useCallback, useEffect, useRef, useState } from "react";
import { createEmtpyGrid, ROWS, COLS, DIRECTIONS } from "./utils/utils";
import { twMerge } from "tailwind-merge";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { Button } from "./components/Button";
import { Select } from "./components/Select";

function App() {
  const [grid, setGrid] = useState<number[][]>(createEmtpyGrid());
  const [isPlaying, setIsPlaying] = useState(false); // State to check if game is playing or not

  // Because we are using setInterval, we need to use useRef to keep track of the current value
  // and not take the outdated values
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  // useCallback is used to memoize the function, so that it doesn't get recreated on every render
  // it is only recreated if one of its dependencies changes
  const runGameofLife = useCallback(() => {
    if (!playingRef.current) {
      // If not playing, return
      return;
    }
    setGrid((currGrid) => {
      const newGrid = currGrid.map((arr) => [...arr]); // Create a deep copy of the grid
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          let liveNeighbours = 0;
          // Check all the neighbours
          DIRECTIONS.forEach(([dirx, diry]) => {
            const neighborRow = row + dirx;
            const neighborCol = col + diry;
            // Check if neighbour is within the grid bounds
            if (
              neighborRow >= 0 &&
              neighborRow < ROWS &&
              neighborCol >= 0 &&
              neighborCol < COLS
            ) {
              liveNeighbours += currGrid[neighborRow][neighborCol];
            }
          });
          // Rules of the game
          if (liveNeighbours < 2 || liveNeighbours > 3) {
            // Underpopulation or overpopulation
            newGrid[row][col] = 0;
          } else if (currGrid[row][col] === 0 && liveNeighbours === 3) {
            // Reproduction
            newGrid[row][col] = 1;
          }
        }
      }
      return newGrid;
    });

    setTimeout(runGameofLife, speedRef.current); // Run this every 100ms
  }, [playingRef, setGrid]);

  // Now that each cell is a button, we can add an onClick event to each cell
  // to toggle the state of the cell
  const [isMouseDown, setIsMouseDown] = useState(false);
  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => setIsMouseDown(false);
  // When mouse enters a cell, if mouse is down, toggle the cell
  const handleMouseEnter = (row: number, col: number) => {
    if (isMouseDown) {
      toggleCellState(row, col);
    }
  };
  // Utilitiy function to toggle cell state
  const toggleCellState = (row: number, col: number) => {
    setGrid((currGrid) => {
      const newGrid = currGrid.map((arr) => [...arr]); // Create a deep copy of the grid
      newGrid[row][col] = currGrid[row][col] ? 0 : 1; // Toggle the cell
      return newGrid;
    });
  };

  // Speed controls
  const [speed, setSpeed] = useState(100);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Make dynamic grid by changing cell size
  const getGridSize = () => {
    const size = Math.min(
      window.innerWidth-32 / COLS,
      window.innerHeight-200 / ROWS,
      20, // Max size
    )
    return size;
  }
  const [cellSize, setCellSize] = useState(getGridSize());
  useEffect(() => {
    const handleResize = () => {
      setCellSize(getGridSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])


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
                runGameofLife();
              }
            }}
          />
          {/* Seed Button */}
          <Button
            onClick={() => {
              const rows = [];
              for (let i = 0; i < ROWS; i++) {
                rows.push(
                  Array.from(Array(COLS), () => (Math.random() > 0.7 ? 1 : 0)),
                );
              }
              setGrid(rows);
            }}
          >
            Seed
          </Button>
          {/* Clear Button */}
          <Button
            onClick={() => {
              setGrid(createEmtpyGrid());
              setIsPlaying(false);
            }}
          >
            Clear
          </Button>

          {/* Select Speed Button */}
          <Select
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            label="Speed"
          >
            <option value={1000}>Slow</option>
            <option value={500}>Medium</option>
            <option value={100}>Fast</option>
            <option value={50}>Supa Fast</option>
          </Select>
        </div>
        {/*
      Tailwind generates all the classes at buildtime, so all the utility classes are 
      predefined and you cannot accomoddate dynamic values, so we didn't define the following
      CSS in classNames, because we cannot pass dynamic values to Tailwind classes.
       */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
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
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => handleMouseEnter(i, j)}
                // Now when you hold on the cursor the cells are populated
                // but when you click on the cell, it doesn't toggle the state
                // so you need to manually add another onClick event on the cell
                onClick={() => toggleCellState(i, j)}
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
