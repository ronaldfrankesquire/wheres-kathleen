import React from "react";
import GameScene from "./components/GameScene.jsx";
import { levelOne } from "./data/levelOneConfig.js";

export default function App() {
  return (
    <main className="app-shell">
      <GameScene level={levelOne} />
    </main>
  );
}
