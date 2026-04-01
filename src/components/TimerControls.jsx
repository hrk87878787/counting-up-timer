import React from 'react';

/**
 * タイマーの操作ボタン（Start, Pause, Reset, Clear）をまとめるコンポーネント
 * @param {boolean} isActive - タイマーが稼働中かどうか
 * @param {function} onStart - Startボタン押下時の処理
 * @param {function} onPause - Pauseボタン押下時の処理
 * @param {function} onReset - Resetボタン（停止して初期値へ）
 */
const TimerControls = ({ isActive, onStart, onPause, onReset, onClear }) => {
  return (
    <div className="timer-controls-container">
      {/* 1. 稼働状況に応じて Start と Pause を切り替えて表示 */}
      {!isActive ? (
        <button onClick={onStart} className="btn start">Start</button>
      ) : (
        <button onClick={onPause} className="btn pause">Pause</button>
      )}

      {/* 2. リセットのボタン */}
      <button onClick={onReset} className="btn reset">Reset</button>
    </div>
  );
};

export default TimerControls;