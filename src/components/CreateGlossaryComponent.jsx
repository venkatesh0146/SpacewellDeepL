import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import LoadingIcon from "./LoadingIcon";
import GlossaryForm from "./GlossaryForm";

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

  const details = {
    isNew: true,
    glossaryDetails: glossaryDetails,
    parentFunctions: {
      handleInputChange: handleInputChange,
      formatFileContent: formatFileContent,
      handleFileChange: handleFileChange,
      getAvailableLanguages: getAvailableLanguages,
      handleCreateGlossary: handleCreateGlossary
    },
  };

  return (
    <>
      {isLoading && <LoadingIcon />}

      <GlossaryForm editedDetails={details} />
      
    </>
  );
};

export default CreateGlossaryComponent;
