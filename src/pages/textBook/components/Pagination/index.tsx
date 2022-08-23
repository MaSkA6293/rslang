import { useEffect, useState } from 'react';
import './index.scss';
import classNames from 'classnames';
import ReactPaginate from 'react-paginate';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTextBook,
  setPage,
} from '../../../../features/textBook/textBook';
import { pageType } from '../../../../types';

export function Pagination() {
  const [initial, setInitial] = useState(-1);
  const { page } = useAppSelector(selectTextBook);

  useEffect(() => setInitial(page), []);

  useEffect(() => setInitial(page), [page]);

  const dispatch = useAppDispatch();

  const handlePageClick = (event: {
    index: number | null;
    selected: number;
    nextSelectedPage: number | undefined;
    event: object;
    isPrevious: boolean;
    isNext: boolean;
    isBreak: boolean;
    isActive: boolean;
  }) => {
    const newOffset = event.selected;
    dispatch(setPage(newOffset as pageType));
  };

  return (
    <div
      className={classNames('control-panel__pagination', 'pagination-control')}
    >
      <h3 className="pagination-control__title">Страница</h3>
      <ReactPaginate
        forcePage={initial}
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={30}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
}
