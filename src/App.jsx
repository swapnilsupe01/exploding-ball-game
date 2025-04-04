import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const BallGame = () => {
  const [showInput, setShowInput] = useState(false);
  const [velocity, setVelocity] = useState("");
  const [balls, setBalls] = useState([]);
  const [running, setRunning] = useState(false);
  const [slowingDown, setSlowingDown] = useState(false);
  const canvasRef = useRef(null);

  const handleVelocityInput = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 20) {
      setVelocity(value);
    } else {
      alert("Please enter a velocity between 1 and 20!");
      setVelocity("");
    }
  };

  const startGame = () => {
    if (!velocity) return;

    setBalls(
      Array.from({ length: velocity }, () => ({
        x: Math.random() * 350 + 20,
        y: Math.random() * 250 + 20,
        dx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2),
        dy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2),
      }))
    );
    setRunning(true);
    setSlowingDown(false);

    setTimeout(() => setSlowingDown(true), 8000);
    setTimeout(() => setRunning(false), 10000);
  };

  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawBalls = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#ff5e00";
        ctx.fill();
        ctx.closePath();
      });
    };

    const moveBalls = () => {
      if (!running) return;

      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;

          if (newX < 10 || newX > canvas.width - 10) ball.dx = -ball.dx;
          if (newY < 10 || newY > canvas.height - 10) ball.dy = -ball.dy;

          return slowingDown
            ? { ...ball, x: newX, y: newY, dx: ball.dx * 0.98, dy: ball.dy * 0.98 }
            : { ...ball, x: newX, y: newY };
        })
      );

      drawBalls();
    };

    const interval = setInterval(moveBalls, 10);
    return () => clearInterval(interval);
  }, [running, slowingDown, balls]);

  return (
    <div className="container">
      <h1 className="title">🎇 Exploding Ball Game 🎇</h1>
      <p className="creator">Created by Swapnil Supe 💜</p>
      <div className="console">
        <p>Welcome! Click **Run** to enter velocity and start the game.</p>
      </div>

      {!showInput ? (
        <button className="run-btn" onClick={() => setShowInput(true)}>▶ Run</button>
      ) : (
        <div className="console input-box">
          <p>Please enter a velocity (1-20):</p>
          <input
            type="number"
            min="1"
            max="20"
            value={velocity}
            onChange={handleVelocityInput}
          />
          {velocity && <button className="start-btn" onClick={startGame}>Start</button>}
        </div>
      )}

      {running && (
        <div className="canvas-container">
          <canvas ref={canvasRef} width={400} height={300}></canvas>
        </div>
      )}
    </div>
  );
};

export default BallGame;
