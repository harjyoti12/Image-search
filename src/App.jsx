
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import search from "./icon"; // Ensure this path is correct
import axios from "axios";

const App = () => {
  const Api_Url = "https://api.unsplash.com/search/photos";
  const Api_Key = import.meta.env.VITE_API_KEY;
  const IMAGES_PER_PAGES = 20;
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");

  const fetchImages = useCallback(async () => {
    if (!searchInput.current.value) return;
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${Api_Url}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGES}&client_id=${Api_Key}`
      );
      setImages(data.results);
      console.log(`Fetching images with query: ${searchInput.current.value}`);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (error) {
      setError("Error fetching images. Try again later.");
      console.log(error.message);
      setLoading(false);
    }
  }, [page, Api_Key]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (evt) => {
    evt.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container flex justify-center items-center flex-col">
      <h1 className="text-6xl font-semibold mt-14 text-[#FF0080] max-sm:text-3xl ">
        Image Search
      </h1>
      <div className="w-4/5 mt-12 flex items-center justify-center">
        <form onSubmit={handleSearch} className="h-3/4 flex">
          <input
            type="search"
            placeholder="Type something to search..."
            className="w-[34vw] p-3 placeholder:text-[#FF5580] font-semibold outline-[#FF5580] rounded-[.6rem] shadow-xl cursor-pointer max-sm:w-[70vw]"
            ref={searchInput}
          />
          <button
            type="submit"
            className="bg-black rounded-[.8rem] flex items-center justify-center p-2"
          >
            <img
              className="w-6 h-6 object-cover"
              src={search}
              alt="Search Icon"
            />
          </button>
        </form>
      </div>
      <div className="text-white rounded-md p-3 m-5 filters max-sm:gap-3 w-full">
        <div
          onClick={() => handleSelection("nature")}
          className="mr-4 bg-[#FF0080]"
        >
          Nature
        </div>
        <div
          onClick={() => handleSelection("birds")}
          className="mr-4 bg-[#FF0080]"
        >
          Birds
        </div>
        <div
          onClick={() => handleSelection("cats")}
          className="mr-4 bg-[#FF0080]"
        >
          Cats
        </div>
        <div
          onClick={() => handleSelection("shoes")}
          className="mr-4 bg-[#FF0080]"
        >
          Shoes
        </div>
      </div>
      {loading ? (
        <div id="wifi-loader">
          <svg className="circle-outer" viewBox="0 0 86 86">
            <circle className="back" cx="43" cy="43" r="40"></circle>
            <circle className="front" cx="43" cy="43" r="40"></circle>
            <circle className="new" cx="43" cy="43" r="40"></circle>
          </svg>
          <svg className="circle-middle" viewBox="0 0 60 60">
            <circle className="back" cx="30" cy="30" r="27"></circle>
            <circle className="front" cx="30" cy="30" r="27"></circle>
          </svg>
          <svg className="circle-inner" viewBox="0 0 34 34">
            <circle className="back" cx="17" cy="17" r="14"></circle>
            <circle className="front" cx="17" cy="17" r="14"></circle>
          </svg>
          <div className="text" data-text="Searching"></div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-10 w-full ml-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative w-[200px] h-[200px] rounded-[10px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 cursor-pointer max-sm:w-[70vw] object-cover"
            >
              <img
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full h-full rounded-[10px]"
              />
              <button
                onClick={() => handleDownload(image.links.html)}
                className="absolute bottom-2 right-2 bg-[#FF0080] text-white p-1 rounded"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
      {loading ? (
        ""
      ) : (
        <div className="flex justify-center items-center gap-6 m-4 ">
          {page > 1 && (
            <button
              className="bg-[#FF0080] p-2 text-white rounded-[.2rem]"
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
          )}
          {page < totalPages && (
            <button
              className="bg-[#FF0080] p-2 rounded-[.2rem] text-white"
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default App;

