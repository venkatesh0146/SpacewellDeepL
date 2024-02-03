import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex p-5 justify-between border-solid border-2 border-[#dddddd]">
      <Link to={"/"}>
        {" "}
        <img src={"./spacewell-logo.png"} alt="no img" width={100} />
      </Link>
      <div className="pt-2">
        <Link
          to={"newglossary"}
          className="  hover:text-teal-400 rounded-lg border-black-500 p-2"
        >
          Create New Glossary
        </Link>
        <Link
          className="  hover:text-teal-400 rounded-lg border-black-500 p-2"
          to={"translate"}
        >
          Translate Document
        </Link>
      </div>
    </div>
  );
};

export default Header;
