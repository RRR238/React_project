import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./App.css";

function App() {

  /*define state hooks*/
  const [properties, setProperties] = useState([])
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true) 

  useEffect(() => {

    /*create function initialFetch which call function fetchItems with parameter currentPage set to 1 and
    assign fetched results to variable data. This fucntion is called immediatelly after index.html is loaded to browser and
    returns items which will be displayed on first page*/

    const initialFetch = async () => {
      const data = await fetchItems(1)
      setProperties(data);
    }
    /*call fn. initialFetch */
    initialFetch()
  }, [])

  /*function fetchItems which call an endpoint which return desired items from DB*/
  const fetchItems = async (currentPage: number) => {
    try {

      /*set state to true in order to display loading circle in FE*/
      setIsLoading(true)
      /*fetch data from endpoint */
      const res = await fetch(
        "http://localhost:3000/data?page=" + currentPage.toString()
      )
      const data = await res.json()
      /*return fetched data*/
      return data
    } catch (error) {
      setError(true)
      throw new Error("Error while fetching data")
    } finally {
      /*set state to false in order to re render the FE and display items instead of loading circle*/

      setIsLoading(false)
    }
  }
/*function which is called when user clicks on different page button in pagination*/
  const handlePageClick = async (data: any) => {
    const currentPage: number = data.selected + 1
    /*fn. fetchItems is called with parameter which represents current page in pagination*/
    const itemsFromServer = await fetchItems(currentPage);
    setProperties(itemsFromServer);
  };

  /*fn. which will call endpoint "refresh" and when the operation at backend is done, page in browser will be automatically refreshed
  so the new items from refreshed DB will be displayed*/

  const triggerRefresh = async () => {
    setIsLoading(true)
    const resp = await fetch("http://localhost:3000/refresh");
    if (!resp.ok) {
      throw new Error(`Error! status: ${resp.status}`);
    }
    setIsLoading(false)
    window.location.reload();
  };

  /*Frontend part */

  return (
    <div className="wrapper">
      {/* button for data refresh*/}
      <button className="refresh-btn" onClick={triggerRefresh}> 
        Refresh Data
      </button>
      {/*if there is an error while fetching new data, error message is displayed to the user (state of error variable is changed)*/}
      {error ? (
        <p className="error-msg">Error while fetching properties</p>
      ) : null}
      {/* while data are being fetched, loading circle is displayed*/}
      {isLoading ? (
        <div className="loader-wrapper">
          <div className="loader" />
        </div>
      ) : (
        <>
        {/* when fetching finishes, state of variable isLoading is changed and thus following block (fetched items) is diplayed to the user*/}
          <div className="items-wrapper">
            {properties?.map(
              (property: { Title: string; ImageURL: string }) => (
                <div className="item">
                  <img alt={property.Title} src={property.ImageURL} />
                  <h3>{property.Title}</h3>
                </div>
              )
            )}
          </div>
        </>
      )}
      {/*pagination*/}
      <div className="pagination">
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          pageCount={25}
          onPageChange={handlePageClick}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
        />
      </div>
    </div>
  );
}

export default App;
