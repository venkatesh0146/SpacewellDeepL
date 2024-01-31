// LoadingIcon.js

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingIcon = () => (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-4xl" />
  </div>
);

export default LoadingIcon;
