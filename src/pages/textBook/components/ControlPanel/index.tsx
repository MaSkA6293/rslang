import Complexity from '../–°omplexity';
import { Pagination } from '../Pagination';
import './index.scss';

function ControlPanel() {
  return (
    <div className="control-panel">
      <Complexity />
      <Pagination />
    </div>
  );
}

export default ControlPanel;
