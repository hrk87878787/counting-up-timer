/**
 * 秒数（number）を受け取り、表示用の形式（string）に変換する
 * @param {number} seconds - タイマーの秒数（マイナスは超過時間を表す）
 * @returns {string} - "mm:ss" または "+mm:ss"
 */
export const formatTime = (seconds) => {
  // 1. 超過（マイナス）判定
  const isOver = seconds < 0;
  
  // 2. 計算のために絶対値を取得
  const absSeconds = Math.abs(seconds);
  
  // 3. 分と秒を計算
  const mm = Math.floor(absSeconds / 60);
  const ss = absSeconds % 60;

  // 4. 2桁のゼロ埋め（例：5秒 -> "05"）
  const formattedMM = String(mm).padStart(2, '0');
  const formattedSS = String(ss).padStart(2, '0');

  // 5. 超過なら "+" を付与して返す
  const prefix = isOver ? '+' : '';
  
  return `${prefix}${formattedMM}:${formattedSS}`;
};

/**
 * "mm:ss" 形式の入力文字列を総秒数（number）に変換する
 * @param {string} timeString - ユーザー入力（例: "03:30"）
 * @returns {number} - 総秒数（例: 210）
 */
export const parseTimeToSeconds = (timeString) => {
  const parts = timeString.split(':');
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;

  return (minutes * 60) + seconds;
};
