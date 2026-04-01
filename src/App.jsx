import React, { useState } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TimerInput from './components/TimerInput';
import TimerControls from './components/TimerControls';
import { useTimer } from './hooks/useTimer';
import './App.css';

function App() {
  // 1. 設定時間を管理する状態（初期値は3分 = 180秒）
  const [initialTime, setInitialTime] = useState(180);

  // 2. カスタムフックからタイマー機能を取り出す
  const { seconds, isActive, start, pause, reset } = useTimer(initialTime);

  // --- ハンドラー関数 ---

  // 入力欄で時間が変更された時
  const handleSetTime = (newSeconds) => {
    setInitialTime(newSeconds);
    reset(newSeconds); // 設定が変わったらタイマーもその値でリセット
  };

  // Resetボタン：設定した時間に戻す
  const handleReset = () => {
    reset(initialTime);
  };

  return (
    <div className="container">
      <h1>プレゼンタイマー</h1>
      
      <TimerDisplay seconds={seconds} />

      <TimerInput 
        onSetTime={handleSetTime}
        seconds={initialTime}
        disabled={isActive} // 動作中は入力不可
      />

      <TimerControls 
        isActive={isActive}
        onStart={start}
        onPause={pause}
        onReset={handleReset}
      />
      
      <p className="hint">
        ※ 00:00 を過ぎると自動的にカウントアップ（超過表示）が始まります。
      </p>
    </div>
  );
}

export default App;