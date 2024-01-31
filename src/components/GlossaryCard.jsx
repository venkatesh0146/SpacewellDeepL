// GlossaryCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const GlossaryCard = ({ glossary }) => {
  const {
    glossary_id,
    name,
    ready,
    source_lang,
    target_lang,
    creation_time,
    entry_count,
  } = glossary;

  return (
    <Link to={`/glossary/${glossary_id}`}>
      <div className="max-w-md mx-auto bg-white shadow-md overflow-hidden md:max-w-2xl mb-4">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {ready ? "Ready" : "Not Ready"}
            </div>
            {name}
            <p className="mt-2 text-gray-500">
              Source Language: {source_lang}, Target Language: {target_lang}
            </p>
            <p className="mt-2 text-gray-500">Entry Count: {entry_count}</p>
            <p className="mt-2 text-gray-500">
              Creation Time: {new Date(creation_time).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GlossaryCard;
