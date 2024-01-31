const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
const DeepL = require("deepl-node");

const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

// Replace 'YOUR_DEEPL_API_KEY' with your actual DeepL API key
const deepLApiKey = "19f25807-973c-43bc-ba87-4a4a0f55a90f:fx";
const translator = new DeepL.Translator(deepLApiKey);

app.post("/create-glossary", async (req, res) => {
  const { name, source_lang, target_lang, entries } = req.body;

  try {
    const existingGlossaries = await translator.listGlossaries();
    const glossaryExists = existingGlossaries.some(
      (glossary) => glossary.name === name
    );

    if (glossaryExists) {
      res.statusCode(401).send("Glossary with the same name already exists.");
    }
    console.log(req.body);

    const entries = new DeepL.GlossaryEntries({ entries: req.body.entries });
    const glossaryInfo = await translator.createGlossary(
      name,
      source_lang,
      target_lang,
      entries
    );
    res.send(glossaryInfo);
  } catch (error) {
    console.error("Error creating glossary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/allglossary", async (req, res) => {
  const deepLApiUrl = "https://api-free.deepl.com/v2/glossaries";
  console.log(req.body);

  const response = await fetch(deepLApiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `DeepL-Auth-Key ${deepLApiKey}`,
    },
  });

  const responseData = await response.json();
  res.json(responseData);
});

app.get("/glossarydetails/:glossaryId", async (req, res) => {
  const glossaryId = req.params.glossaryId;
  console.log(glossaryId);
  try {
    const glossaryDetails = await translator.getGlossary(glossaryId);
    const entries = await translator.getGlossaryEntries(glossaryId);
    const formattedResponse = {
      glossary_id: glossaryDetails.glossaryId,
      name: glossaryDetails.name,
      ready: glossaryDetails.ready,
      source_lang: glossaryDetails.sourceLang,
      target_lang: glossaryDetails.targetLang,
      creation_time: glossaryDetails.creationTime,
      entry_count: glossaryDetails.entryCount,
      entries: entries,
    };
    res.json(formattedResponse);
  } catch (error) {
    console.error(`Error fetching glossary details for ${glossaryId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/glossary/:glossaryId", async (req, res) => {
  const glossaryId = req.params.glossaryId;
  console.log(glossaryId, "here");
  try {
    await translator.deleteGlossary(glossaryId);
    res.send("success");
  } catch {
    res.statusCode(401).send("failed to delete glossary");
  }
});

app.post("/updateglossary", async (req, res) => {
  console.log(req.body);
  const { name, source_lang, target_lang, entries, editedName } = req.body;
  const existingGlossaries = await translator.listGlossaries();
  const glossary = existingGlossaries.find(
    (glossary) => glossary.name === name
  );
  await translator.deleteGlossary(glossary.glossaryId);
  const gEntries = new DeepL.GlossaryEntries({ entries: entries.implEntries });
  const glossaryInfo = await translator.createGlossary(
    editedName,
    source_lang,
    target_lang,
    gEntries
  );
  res.send(glossaryInfo);
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
