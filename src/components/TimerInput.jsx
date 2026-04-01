import React from 'react';

const TimerInput = ({ onSetTime, seconds, disabled }) => {
  const total = Math.abs(seconds || 0);
  const mm = Math.floor(total / 60).toString().padStart(2, '0');
  const ss = (total % 60).toString().padStart(2, '0');

  const handleInputChange = (type, value) => {
  const inputDigits = value.replace(/\D/g, '');

  // 空になったら 00 に戻す
  if (inputDigits === '') {
    updateParentTime(type, 0);
    return;
  }

  // 2. 【重要】入力された文字列の「右側2文字」を切り出す
  // これにより、"012" -> "12"、"56"で全選択して"1" -> "1" となります
  const lastTwo = inputDigits.slice(-2);
  const newValue = parseInt(lastTwo, 10);

  // 3. バリデーション
  if (type === 'ss' && newValue > 59) return;

  // 4. 親の状態を更新
  updateParentTime(type, newValue);
};

  const updateParentTime = (type, newValue) => {
    const currentMm = Math.floor(total / 60);
    const currentSs = total % 60;

    let newTotalSeconds;
    if (type === 'mm') {
      newTotalSeconds = newValue * 60 + currentSs;
    } else {
      newTotalSeconds = currentMm * 60 + newValue;
    }
    onSetTime(newTotalSeconds);
  };

  const handleFocus = (e) => e.target.select();

  return (
    <div className="timer-input-container">
      <label className="input-label">設定時間 (mm:ss)</label>
      <div className={`timer-input-group ${disabled ? 'disabled' : ''}`}>
        <input
          type="text"
          value={mm}
          onChange={(e) => handleInputChange('mm', e.target.value)}
          onFocus={handleFocus}
          disabled={disabled}
          className="time-segment"
          inputMode="numeric"
        />
        <span className="separator">:</span>
        <input
          type="text"
          value={ss}
          onChange={(e) => handleInputChange('ss', e.target.value)}
          onFocus={handleFocus}
          disabled={disabled}
          className="time-segment"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default TimerInput;