import React from "react";

interface PaginationInterface {
    currentPage: number;
    totalPages: number;
    paginate: any; // Giữ nguyên 'any' theo code cũ của bạn
}

export const Pagination: React.FC<PaginationInterface> = (props) => {

    const pageList = [];
    if (props.currentPage === 1) {
        pageList.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            pageList.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            pageList.push(props.currentPage + 2);
        }
    }
    else if (props.currentPage > 1) {
        // page -2
        if (props.totalPages >= 3) {
            pageList.push(props.currentPage - 2);
        }
        // page -1
        if (props.totalPages >= 2) {
            pageList.push(props.currentPage - 1);
        } 
        // current page
        pageList.push(props.currentPage);
        // page +1
        if (props.totalPages >= props.currentPage + 1) {
            pageList.push(props.currentPage + 1);
        }
        // page +2
        if (props.totalPages >= props.currentPage + 2) {
            pageList.push(props.currentPage + 2);
        }
    }

    return (
        <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item" onClick={() => props.paginate(1)} >
                    <button className="page-link">
                        First
                    </button>
                </li>
                {pageList.map((page, index) => (
                    <li className="page-item"
                        key={`${page}-${index}`} 
                        onClick={() => props.paginate(page)} >
                        <button className={"page-link" + (props.currentPage === page ? " active" : "")}>
                            {page}
                        </button>
                    </li>
                ))}
                <li className="page-item" onClick={() => props.paginate(props.totalPages)}>
                    <button className="page-link">
                        Last
                    </button>
                </li>
            </ul>
        </nav>
    );
}