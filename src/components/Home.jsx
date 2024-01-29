import { useHistory } from "react-router-dom";
import Button from "./Button";
import CreateGlossary from "./CreateGlossary";

const Home = () => {
  return (
    <div className="flex justify-end pt-2">
      <Button placeholder={"Create New Glossary"} />
    </div>
  );
};

export default Home;
