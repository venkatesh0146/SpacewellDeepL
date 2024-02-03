import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import { saveAs } from "file-saver";
import LoadingIcon from "./LoadingIcon";
import GlossaryForm from "./GlossaryForm";

const ViewGlossaryComponent = () => {
  const { glossaryId } = useParams();
  const navigate = useNavigate();
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

  const [glossaryDetails, setGlossaryDetails] = useState(null);
  
  const [editedDetails, setEditedDetails] = useState({
    name: "",
    sourceLang: "",
    targetLang: "",
    entries: ""
  });


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    const fetchGlossaryDetails = async () => {
      try {
        const response = await fetch(
          `${config.baseUrl}/glossarydetails/${glossaryId}`
        );
        const responseData = await response.json();
       
        if (
          responseData &&
          responseData.entries &&
          responseData.entries.implEntries
        ) {
          const implEntries = responseData.entries.implEntries;
          setFileContent(implEntries);
          const entriesString = Object.entries(implEntries)
            .map(([source, target]) => `${source}\t${target}`)
            .join("\n");
          responseData.entriesString = entriesString
          setGlossaryDetails(responseData);
        }
        setEditedDetails({
          name: responseData.name,
          sourceLang: responseData.source_lang,
          targetLang: responseData.target_lang,
          entries: responseData.entriesString
        });
      } catch (error) {
        console.error("Error fetching glossary details:", error);
      }
    };

    fetchGlossaryDetails();
  }, [glossaryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateGlossary = () => {
    console.log(editedDetails);
    fetch(config.baseUrl + "/updateglossary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        editedName: editedDetails.name,
        source_lang: editedDetails.sourceLang,
        target_lang: editedDetails.targetLang,
        entries: { implEntries: fileContent },
        name: glossaryDetails.name,
      }),
    }).then((data) => console.log(data));
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteGlossary = () => {
    openDeleteModal();
  };
  const getAvailableLanguages = (selectedLang) => {
    return languages.filter((lang) => lang !== selectedLang);
  };

  const confirmDelete = async () => {
    fetch(config.baseUrl + "/glossary/" + glossaryId, {
      method: "DELETE",
    }).then(() => {
      closeDeleteModal();
      navigate("/");
    });
    closeDeleteModal();
  };

  const downloadCSV = () => {
    if (
      glossaryDetails &&
      glossaryDetails.entries &&
      glossaryDetails.entries.implEntries
    ) {
      const implEntries = glossaryDetails.entries.implEntries;
      const csvData = Object.entries(implEntries)
        .map(([source, target]) => `${source},${target}`)
        .join("\n");

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      saveAs(blob, glossaryDetails.name + "Entires.csv");
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const formattedContent = formatFileContent(event.target.result);
        setFileContent(formattedContent);
        const entriesString = Object.entries(formattedContent)
          .map(([source, target]) => `${source}\t${target}`)
          .join("\n");
        setEditedDetails({
          name: editedDetails.name,
          sourceLang: editedDetails.source_lang,
          targetLang: editedDetails.target_lang,
          entries: entriesString
        });
      };
      reader.readAsText(uploadedFile);
    }
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
  useEffect(() => {
    console.log("Updated Glossary Details:", glossaryDetails);
    console.log("File Content:", fileContent);
  }, [glossaryDetails, fileContent]);

  const details = {
    isNew: false,
    glossaryDetails: editedDetails,
    isDeleteModalOpen: isDeleteModalOpen,
    parentFunctions: {
      handleInputChange: handleInputChange,
      handleUpdateGlossary: handleUpdateGlossary,
      formatFileContent: formatFileContent,
      handleFileChange: handleFileChange,
      downloadCSV: downloadCSV,
      confirmDelete: confirmDelete,
      getAvailableLanguages: getAvailableLanguages,
      handleDeleteGlossary: handleDeleteGlossary,
      closeDeleteModal: closeDeleteModal,
    },
  };

  if (!glossaryDetails) {
    return <LoadingIcon />;
  }

  return <GlossaryForm editedDetails={details} />;
};

export default ViewGlossaryComponent;
