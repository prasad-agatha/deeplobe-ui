import ReactPaginate from "react-paginate";

const Paginate = ({ state, page, setPage }) => {
  const handlePageChange = (event) => setPage(event.selected + 1);

  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      pageClassName="page-item"
      pageLinkClassName="page-link font-10 px-0 rounded-0"
      previousClassName="page-item"
      previousLinkClassName="page-link font-10 px-0 rounded-0"
      nextClassName="page-item"
      nextLinkClassName="page-link font-10 px-0 rounded-0"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link font-10 px-0 rounded-0"
      pageCount={state.pages}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={handlePageChange}
      containerClassName="pagination img-paginate mt-2"
      activeClassName="active"
      forcePage={page - 1}
    />
  );
};

export default Paginate;
