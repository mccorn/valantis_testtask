import { useEffect, useState } from 'react';
import Card from './Card';
import { CardData } from '../types';

type GalleryProps = {
  currentPage: number,
  totalCount: number,
  countPerPage: number,
  data?: CardData[] | null,
  onChangePage: (num: number) => void,
}

function Gallery(props: GalleryProps) {
  const {
    currentPage = 0,
    totalCount = 4,
    countPerPage = 4,
    data = [],
    onChangePage
  } = props;

  const [numPage, setNumPage] = useState(currentPage);
  const countPages = Math.ceil(totalCount / countPerPage);

  useEffect(() => {setNumPage(currentPage)}, [currentPage])

  const handlePrevClick = () => setNumPage((prev) => {
    const next = Math.max(prev - 1, 0);
    onChangePage(next);
    return next;
  });
  const handleNextClick = () => setNumPage((prev) => {
    const next = Math.min(prev + 1, Math.ceil(totalCount / countPerPage) - 1);
    onChangePage(next);
    return next;
  });

  return (
    <div className="gallery column">
      <div className="gallery__header" style={{ marginBottom: 20 }}>
        <button onClick={handlePrevClick} disabled={numPage === 0}>prev</button>
        {numPage + 1} / {countPages}
        <button onClick={handleNextClick} disabled={numPage === countPages - 1}>next</button>
      </div>
      <div className="gallery__body">
        {
          data 
            ? (data.length ? data.map((node, idx) => <Card key={idx} data={node} />) : "Empty") 
            : "Loading..."
        }
      </div>
    </div>
  )
}

export default Gallery
