import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import { saveAs } from "file-saver";
import Modal from "./Modal";
import useCreateGlossary from "../utils/useCreateGlossary";
import LoadingIcon from "./LoadingIcon";

const GlossaryComponent = ({ isCreateMode }) => {
  const { glossaryId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { handleCreateGlossary } = useCreateGlossary();

  const [glossaryDetails, setGlossaryDetails] = useState(null);
  const [editedDetails, setEditedDetails] = useState({
    name: "",
    source_lang: "en",
    target_lang: "de",
    entries: "",
    entries_format: "tsv",
  });
  const [implEntriesString, setImplEntriesString] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    const fetchGlossaryDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${config.baseUrl}/glossarydetails/${glossaryId}`
        );
        const responseData = await response.json();
        console.log(responseData);
        setGlossaryDetails(responseData);

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
          setImplEntriesString(entriesString);
        }

        setEditedDetails({
          name: responseData.name,
          source_lang: responseData.source_lang,
          target_lang: responseData.target_lang,
        });
      } catch (error) {
        console.error("Error fetching glossary details:", error);
      }
      setIsLoading(false);
    };

    if (!isCreateMode && glossaryId) {
      fetchGlossaryDetails();
    }
  }, [glossaryId, isCreateMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateGlossary = () => {
    const formData = {
      editedName: editedDetails.name,
      source_lang: editedDetails.source_lang,
      target_lang: editedDetails.target_lang,
      entries: { implEntries: fileContent },
      name: glossaryDetails.name,
    };

    const updateGlossaryAPI = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.baseUrl}/updateglossary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();
        console.log("Glossary updated:", responseData);
      } catch (error) {
        console.error("Error updating glossary:", error);
      }
      setIsLoading(false);
      navigate("/");
    };

    updateGlossaryAPI();
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

  const getAvailableLanguages = (excludeLang) => {
    const allLanguages = config.supportedLanguages.map((e) =>
      e.toLocaleLowerCase()
    );
    return allLanguages.filter((lang) => lang !== excludeLang);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    fetch(config.baseUrl + "/glossary/" + glossaryId, {
      method: "DELETE",
    }).then(() => {
      closeDeleteModal();
      setIsLoading(false);
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
        console.log(entriesString);
        setImplEntriesString(entriesString);
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

  return (
    <>
      {isLoading && <LoadingIcon />}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-96 p-8 bg-white rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {isCreateMode ? "Create Glossary" : "Edit Glossary"}
          </h2>
          <form>
            <label className="block mb-4">
              Glossary Name:
              <input
                type="text"
                name="name"
                value={editedDetails.name}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </label>
            <label className="block mb-4">
              Source Language:
              <select
                name="source_lang"
                value={editedDetails.source_lang}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {getAvailableLanguages(editedDetails.target_lang).map(
                  (lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  )
                )}
              </select>
            </label>
            <label className="block mb-4">
              Target Language:
              <select
                name="target_lang"
                value={editedDetails.target_lang}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {getAvailableLanguages(editedDetails.source_lang).map(
                  (lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  )
                )}
              </select>
            </label>
            <div className="mb-4">
              <label className="block mb-2">Entries:</label>
              <textarea
                value={implEntriesString}
                readOnly
                className="w-full p-2 border rounded-md"
                rows="4"
                disabled
              />
            </div>
            {!isCreateMode && (
              <div className="flex justify-end mb-2">
                <a
                  href="#download"
                  onClick={downloadCSV}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Download CSV
                </a>
              </div>
            )}
            <label className="block mb-4">
              Upload CSV File:
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-1 p-2 border rounded-md"
              />
            </label>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={
                  isCreateMode
                    ? () => {
                        setIsLoading(true);
                        handleCreateGlossary(
                          { ...editedDetails, entries: fileContent },
                          navigate
                        );
                      }
                    : handleUpdateGlossary
                }
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                {isCreateMode ? "Create Glossary" : "Update Glossary"}
              </button>
              {!isCreateMode && (
                <button
                  type="button"
                  onClick={handleDeleteGlossary}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Delete Glossary
                </button>
              )}
            </div>
          </form>
          {isDeleteModalOpen && (
            <Modal
              title="Confirm Delete"
              content="Are you sure you want to delete this glossary?"
              onCancel={closeDeleteModal}
              onConfirm={confirmDelete}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default GlossaryComponent;
