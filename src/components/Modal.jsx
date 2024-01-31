const Modal = ({ title, content, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg p-6 mx-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            className="text-gray-500 hover:text-red-600 cursor-pointer"
            onClick={onCancel}
          >
            X
          </button>
        </div>
        <p className="mb-4">{content}</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
