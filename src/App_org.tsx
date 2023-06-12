import React from 'react';
import './App.css';
import { useState,useEffect } from 'react';
import ReactPaginate from 'react-paginate';

function App(){
  
  const [properties, setProperties] = useState([])
  const [error,setError] = useState({})

useEffect(() =>{
  fetch("http://localhost:3000/data?page=1")
  .then(response => response.json())
  .then(res => setProperties(res))
  .catch(err => setError(err))
}, [])

const fetchItems = async(currentPage:number) => {
  const res = await fetch("http://localhost:3000/data?page=" + currentPage.toString())
  const data = await res.json()
  return data
}

  const handlePageClick = async (data:any) =>{

    var currentPage:number = data.selected + 1
    const itemsFromServer = await fetchItems(currentPage)
    setProperties(itemsFromServer)
  }

const triggerRefresh = async () => {
  const resp = await fetch("http://localhost:3000/refresh")
  if (!resp.ok) {
    throw new Error("Error! status: ${resp.status}")
  } 
    window.location.reload()
}

  return (
    <div>

      {properties.map((property:{Title:string,ImageURL:string}) => (
        <div>
            <li> {property.Title}</li>
              <img 
                src={property.ImageURL} 
                />
          </div>
               ))}

      <ReactPaginate
      previousLabel = {"<<"}
      nextLabel = {">>"}
      pageCount={25}
      onPageChange={handlePageClick}
      containerClassName="pagination justify-content-center"
      pageClassName= "page-item"
      pageLinkClassName="page-link"
      previousClassName='page-item'
      previousLinkClassName='page-link'
      nextClassName='page-item'
      nextLinkClassName='page-link'
      activeClassName='active'
      />
      <button onClick={triggerRefresh}>Refresh Data</button>
    </div>
  )
}

export default App