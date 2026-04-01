import React from 'react';
import { formatTime } from '../utils/timeFormatter';

/**
 * タイマーのメイン数字を表示するコンポーネント
 * @param {number} seconds - 現在のタイマー秒数
 */
const TimerDisplay = ({ seconds }) => {
  // 1. ユーティリティ関数を使って表示用の文字列（"mm:ss" や "+mm:ss"）を取得
  const displayTime = formatTime(seconds);

  // 2. 0秒未満（超過）かどうかの判定（スタイル変更用）
  const isOver = seconds < 0;

  return (
    <div className="timer-display-container">
      {/* 超過時は 'is-over' というクラスを追加し、
        CSSで文字色を赤くするなどの制御ができるようにします 
      */}
      <div className={`timer-text ${isOver ? 'is-over' : ''}`}>
        {displayTime}
      </div>
    </div>
  );
};

export default TimerDisplay;