import './index.scss';
import classNames from 'classnames';
import { IOptionComplexity } from '../../types';

function OptionComplexity({ value, modifyColor, title }: IOptionComplexity) {
  return (
    <option value={value} className={classNames('chapter__item', modifyColor)}>
      {title}
    </option>
  );
}

export default OptionComplexity;
