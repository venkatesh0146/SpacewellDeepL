import { useState, useEffect } from "react";
import GlossaryCard from "./GlossaryCard";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

const Home = () => {
  const [glossaries, setGlossaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3001/allglossary")
      .then((response) => response.json())
      .then((data) => setGlossaries(data.glossaries))
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error fetching glossaries:", error));
  }, []);

  return (
    <>
      {isLoading && <LoadingIcon />}
      <div className="flex justify-end pt-2">
        <Link
          to={"newglossary"}
          className="border-2 bg-blue-300 rounded-lg font-semibold border-black-500 p-2"
        >
          Create New Glossary
        </Link>
      </div>
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-semibold mb-4">Glossaries</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {glossaries.map((glossary) => (
            <GlossaryCard key={glossary.glossary_id} glossary={glossary} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
