import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import './pagination.css'

const PaginateComp = ({ data, setDataFun, itemsPerPage }) => {
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = Math.min(itemOffset + itemsPerPage, data.length);
        const newData = data.slice(itemOffset, endOffset);
        
        setDataFun(newData);
        setPageCount(Math.ceil(data.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, data, setDataFun]);

    
const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
}


    return (
        <>
            <ReactPaginate
                breakLabel='...'
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="activepage" />
        </>
    )
}

export default PaginateComp;