import { useEffect, useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './index.scss';
import classNames from 'classnames';
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

  const handleChange = (value: string) => {
    dispatch(setGroup(Number(value)));
  };

  return (
    <div className={classNames('control-panel__level level')}>
      <h3 className="level__title">Сложность:</h3>
      <DropdownButton
        as={ButtonGroup}
        key={options[group].title}
        id={`dropdown-variants-${group}`}
        variant={options[group].title}
        title={options[group].title}
        className={classNames('level__chapter', 'chapter')}
        style={{ backgroundColor: color }}
      >
        {options.map((el) => (
          <Dropdown.Item
            key={el.value}
            eventKey={el.title}
            onClick={() => handleChange(el.value)}
            defaultValue={group}
            active={el.value === group.toString()}
            style={{
              backgroundColor: colorsOfLevels[Number(el.value)][0],
            }}
            className={classNames('level__chapter-item')}
          >
            {el.title}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

export default Complexity;
