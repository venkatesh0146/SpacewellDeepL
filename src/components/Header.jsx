import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex  p-5 border-black-800 border-2">
      <Link to={"/"}>
        {" "}
        <img src={"./spacewell-logo.png"} alt="no img" width={100} />
      </Link>
    </div>
  );
};

export default Header;
