import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialSeconds = 0) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null); // setIntervalのIDを保持する箱

  // タイマーを開始する
  const start = () => setIsActive(true);

  // タイマーを一時停止する
  const pause = () => setIsActive(false);

  // タイマーを特定の値にリセットする
  const reset = (resetValue) => {
    setIsActive(false);
    setSeconds(resetValue);
  };

  // 【重要】タイマーの実行ロジック
  useEffect(() => {
    if (isActive) {
      // 1秒ごとに実行
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1); // 1秒ずつ減らす（マイナスになってもそのまま減らし続ける）
      }, 1000);
    } else {
      // 停止中はインターバルをクリア
      clearInterval(timerRef.current);
    }

    // クリーンアップ処理（コンポーネントが消える時にタイマーを止める）
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  return {
    seconds,    // 現在の残り秒数
    isActive,   // 動いているかどうか
    start,      // 開始関数
    pause,      // 一時停止関数
    reset       // リセット関数
  };
};