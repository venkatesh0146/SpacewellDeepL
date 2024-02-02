import { useState, useEffect } from "react";
import GlossaryCard from "./GlossaryCard";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

const Home = () => {
  const [glossaries, setGlossaries] = useState([]);
  const [filteredGlossaries, setFilteredGlossaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
  
    fetch("http://localhost:3001/allglossary")
      .then((response) => response.json())
      .then((data) => {setGlossaries(data.glossaries);  setFilteredGlossaries(data.glossaries)})
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error fetching glossaries:", error));
  }, []);

  const searchGlossaries = (e) => {
    setGlossaries(filteredGlossaries.filter((g) => g.name.includes(e.target.value)))
  }

  return (
    <>
      {isLoading && <LoadingIcon />}
      
      <div className="container mx-auto mt-8">
        
         <h1 className="text-3xl font-semibold mb-4">Glossaries</h1>

    <div className=" relative">
        <div className="  absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input onChange={searchGlossaries}  type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search glossaries" required />
    </div>
  
      
        
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {glossaries.map((glossary) => (
            <GlossaryCard key={glossary.glossary_id} glossary={glossary} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
