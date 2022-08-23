import React, { useEffect, useState } from 'react';
import './index.scss';
import classNames from 'classnames';
import OptionComplexity from '../OptionComplexity';
import { options, colorsOfLevels } from '../../types';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTextBook,
  setGroup,
} from '../../../../features/textBook/textBook';

function Complexity() {
  const [color, setColor] = useState<string>(colorsOfLevels[0][0]);

  const { group } = useAppSelector(selectTextBook);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const color: string = colorsOfLevels[group][0];
    setColor(color);
  }, [group]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setGroup(Number(event.target.value)));
  };

  return (
    <div className={classNames('control-panel__level level')}>
      <h3 className="level__title">Сложность:</h3>
      <select
        defaultValue={group}
        onChange={handleChange}
        id="chapter"
        className={classNames('level__chapter', 'chapter')}
        style={{ backgroundColor: color }}
      >
        {options.map((el) => (
          <OptionComplexity
            key={el.value}
            value={el.value}
            modifyColor={el.modifyColor}
            title={el.title}
          />
        ))}
      </select>
    </div>
  );
}

export default Complexity;
