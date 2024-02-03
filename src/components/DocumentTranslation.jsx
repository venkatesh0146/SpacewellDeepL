import React, { useState } from "react";
import LoadingIcon from "./LoadingIcon";

const DocumentTranslation = () => {
  const [isLoading] = useState(false);
  const [, setUploadedFile] = useState(null);
  const [translatedDocument] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleTranslateDocument = async () => {};

  const handleDownloadTranslatedDocument = async () => {};

  return (
    <>
      {isLoading && <LoadingIcon />}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-96 p-8 bg-white rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Translate Document</h2>
          <form>
            <label className="block mb-4">
              Upload Document:
              <input
                type="file"
                accept=".docx, .pptx, .xlsx, .pdf, .html, .txt, .xlf, .xliff"
                onChange={handleFileChange}
                className="mt-1 p-2 border rounded-md"
              />
            </label>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleTranslateDocument}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Translate Document
              </button>
            </div>
          </form>

          {translatedDocument && (
            <div className="mt-4">
              <p className="font-bold mb-2">Translated Document:</p>
              <p>Document ID: {translatedDocument.document_id}</p>
              <p>Document Key: {translatedDocument.document_key}</p>
              <button
                type="button"
                onClick={handleDownloadTranslatedDocument}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-2"
              >
                Download Translated Document
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentTranslation;
