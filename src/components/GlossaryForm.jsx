import React from 'react';
import Modal from './Modal';

const GlossaryForm = (details) => {
    const isNew = details.editedDetails.isNew;
    const glossaryDetails = details.editedDetails.glossaryDetails;
    const parentFunctions = details.editedDetails.parentFunctions;
    const isDeleteModalOpen = details.editedDetails.isDeleteModalOpen;
    
  return (
    
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white shadow-xl border-solid border-2 border-[#dddddd] rounded-[2rem]">
      <h2 className="text-2xl font-bold mb-4">Edit Glossary</h2>
      <form>
        <label className="block mb-4">
          Glossary Name:  <sup title="required">*</sup>
          <input
            type="text"
            name="name"
            value={glossaryDetails.name}
            onChange={parentFunctions.handleInputChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </label>
        <label className="block mb-4">
          Source Language:
          <select
            name="sourceLang"
            value={glossaryDetails.sourceLang}
            onChange={parentFunctions.handleInputChange}
            className="w-full mt-1 p-2 border rounded-md"
          >
            {parentFunctions.getAvailableLanguages(glossaryDetails.targetLang).map((lang) => (
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
            onChange={parentFunctions.handleInputChange}
            className="w-full mt-1 p-2 border rounded-md"
          >
            {parentFunctions.getAvailableLanguages(glossaryDetails.sourceLang).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>
        <div className="mb-4">
          <label className="block mb-2">Entries:</label>
          <textarea
            value={glossaryDetails.entries}
            readOnly
            className="w-full p-2 border rounded-md"
            rows="4"
            disabled
          />
        </div>
        { !isNew && (<div className="flex justify-end mb-2">
          <a
            href="#download"
            onClick={parentFunctions.downloadCSV}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Download CSV
          </a>
        </div>)}

        <label className="block mb-4">
          Upload CSV File:  <sup title="required">*</sup>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {parentFunctions.handleFileChange(e)}}
            className="mt-1 p-2 border rounded-md"
          />
        </label>
        <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an
									asterisk <sup title="Required field">*</sup></p>

        { !isNew && (<div className="flex justify-between">
          <button
            type="button"
            onClick={parentFunctions.handleUpdateGlossary}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Update Glossary
          </button>
          <button
            type="button"
            onClick={() => {
                 console.log(parentFunctions.handleDeleteGlossary());
                }}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Delete Glossary
          </button>
        </div> )}
        { isNew && (
            <button disabled = {!(glossaryDetails.name && glossaryDetails.entries)} 
            onClick={parentFunctions.handleCreateGlossary}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            Create Glossary
          </button>
        )}
      </form>
      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          content="Are you sure you want to delete this glossary?"
          onCancel={parentFunctions.closeDeleteModal}
          onConfirm={parentFunctions.confirmDelete}
        />
      )}
    </div>
  </div>
  );
}

export default GlossaryForm;
