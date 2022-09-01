import { groupType } from '../../../../types';
import './index.scss';

interface LevelSelectProps {
  level: groupType;
  setLevel: (level: groupType) => void;
}

const LEVELS: groupType[] = [0, 1, 2, 3, 4, 5];

function LevelSelect({ level, setLevel }: LevelSelectProps) {
  return (
    <div className="level-select">
      <select
        value={level}
        onChange={(e) => setLevel(Number(e.target.value) as groupType)}
      >
        {LEVELS.map((l) => (
          <option key={l} value={l}>{`Уровень ${l + 1}`}</option>
        ))}
      </select>
    </div>
  );
}

export default LevelSelect;
