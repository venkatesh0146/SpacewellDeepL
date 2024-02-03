import config from "../config";

const useCreateGlossary = () => {
  const handleCreateGlossary = async (formData, navigate) => {
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
    navigate("/");
  };

  return { handleCreateGlossary };
};

export default useCreateGlossary;
