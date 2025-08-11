import React from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const App = () => {
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const [penWidth, setPenWidth] = React.useState(5);
  const [eraserWidth, setEraserWidth] = React.useState(10);
  const [color, setColor] = React.useState("#df4b26");
  const isDrawing = React.useRef(false);

  const getCurrentWidth = () => (tool === "eraser" ? eraserWidth : penWidth);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        strokeWidth: getCurrentWidth(),
        strokeColor: tool === "pen" ? color : "#000000",
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      {/* TOOLBAR */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "white",
          padding: 10,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "220px",
        }}
      >
        {/* Tool Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => setTool("pen")}
            style={{
              backgroundColor: tool === "pen" ? "#df4b26" : "#eee",
              color: tool === "pen" ? "white" : "black",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Pen
          </button>
          <button
            onClick={() => setTool("eraser")}
            style={{
              backgroundColor: tool === "eraser" ? "#df4b26" : "#eee",
              color: tool === "eraser" ? "white" : "black",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Eraser
          </button>
        </div>

        {/* Color Palette */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {["#df4b26", "#000", "#2e86de", "#27ae60", "#f1c40f", "#9b59b6"].map(
            (c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: c,
                  border: c === color ? "2px solid black" : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            )
          )}
        </div>

        {/* Width Controls */}
        <div>
          <label>Pen Width: {penWidth}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={penWidth}
            onChange={(e) => setPenWidth(parseInt(e.target.value))}
            disabled={tool !== "pen"}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Eraser Width: {eraserWidth}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={eraserWidth}
            onChange={(e) => setEraserWidth(parseInt(e.target.value))}
            disabled={tool !== "eraser"}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* CANVAS */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Start drawing!" x={10} y={10} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.strokeColor || "#000"}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;

