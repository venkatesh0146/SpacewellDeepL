import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import LoadingIcon from "./LoadingIcon";

const CreateGlossaryComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const languages = [
    "DE",
    "EN",
    "ES",
    "FR",
    "IT",
    "JA",
    "NL",
    "PL",
    "PT",
    "RU",
    "ZH",
  ].map((e) => e.toLocaleLowerCase());

  const [glossaryDetails, setGlossaryDetails] = useState({
    name: "",
    sourceLang: "en",
    targetLang: "de",
    entries: "",
    entriesFormat: "tsv",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGlossaryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if(!uploadedFile){
      setGlossaryDetails((prevDetails) => ({
        ...prevDetails,
        entries: "",
      }));
    }

    if (uploadedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        console.log(fileContent);
        setGlossaryDetails((prevDetails) => ({
          ...prevDetails,
          entries: fileContent,
        }));
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleCreateGlossary = () => {
    const formData = {
      name: glossaryDetails.name,
      source_lang: glossaryDetails.sourceLang,
      target_lang: glossaryDetails.targetLang,
      entries_format: glossaryDetails.entriesFormat,
      entries: glossaryDetails.entries ? formatFileContent(glossaryDetails.entries): '',
    };

    console.log(formData);

    const createGlossaryAPI = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.baseUrl}/create-glossary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();
        console.log("Glossary created:", responseData);

        // You can handle success or show a message to the user
      } catch (error) {
        console.error("Error creating glossary:", error);
        // Handle error or show an error message to the user
      }
      setIsLoading(false);
      navigate("/");
    };
    createGlossaryAPI();
  };

  const formatFileContent = (fileContent) => {
    const lines = fileContent.replaceAll("\r", "").split("\n");

    const formattedObject = lines.reduce((acc, line) => {
      const [source, target] = line.split(",");
      if (source && target) {
        acc[source] = target;
      }
      return acc;
    }, {});
    return formattedObject;
  };

  const getAvailableLanguages = (selectedLang) => {
    return languages.filter((lang) => lang !== selectedLang);
  };

  return (
    <>
      {isLoading && <LoadingIcon />}
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white shadow-xl border-solid border-2 border-[#dddddd] rounded-[2rem]">
          <h2 className="text-2xl font-bold mb-4">Create Glossary</h2>
          <label className="block mb-4">
            Glossary Name: <sup title="required">*</sup> 
            <input
              type="text"
              name="name"
              value={glossaryDetails.name}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md" required
            />
         </label>
          <label className="block mb-4">
            Source Language:
            <select
              name="sourceLang"
              value={glossaryDetails.sourceLang}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            >
              {getAvailableLanguages(glossaryDetails.targetLang).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            Target Language:
            <select
              name="targetLang"
              value={glossaryDetails.targetLang}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            >
              {getAvailableLanguages(glossaryDetails.sourceLang).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            Entries (in TSV format):
            <textarea
              name="entries"
              value={glossaryDetails.entries}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
              disabled
            />
          </label>
          <label className="block mb-4">
            Upload CSV File: <sup title="required">*</sup> 
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-1 p-2 border rounded-md" required
            />
          </label>
          <p class="text-xs text-red-500 text-right my-3">Required fields are marked with an
									asterisk <sup title="Required field">*</sup></p>
          <button disabled = {!(glossaryDetails.name && glossaryDetails.entries)} 
            onClick={handleCreateGlossary}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            Create Glossary
          </button>
        </div>
      </div>
      
    </>
  );
};

export default CreateGlossaryComponent;
