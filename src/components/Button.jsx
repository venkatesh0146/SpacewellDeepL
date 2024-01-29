import { Link } from "react-router-dom";

const Button = ({ placeholder }) => {
  return (
    <>
      <Link
        to={"newglossary"}
        className="border-2 bg-blue-300 rounded-lg font-semibold border-black-500 p-2"
      >
        {placeholder}
      </Link>
    </>
  );
};

export default Button;
