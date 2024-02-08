const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
const DeepL = require("deepl-node");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
const port = process.env.port||3001;

app.use(cors());
app.use(bodyParser.json());

// Replace 'YOUR_DEEPL_API_KEY' with your actual DeepL API key
const deepLApiKey = process.env.key;
const translator = new DeepL.Translator(deepLApiKey);

// Error Handling Middleware

// Middleware for checking glossary existence
const checkGlossaryExistence = async (req, res, next) => {
  const { name } = req.body;

  try {
    const existingGlossaries = await translator.listGlossaries();
    const glossaryExists = existingGlossaries.some(
      (glossary) => glossary.name === name
    );

    if (glossaryExists) {
      return res
        .status(401)
        .send("Glossary with the same name already exists.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Routes
app.post("/create-glossary", checkGlossaryExistence, async (req, res, next) => {
  const { name, source_lang, target_lang, entries } = req.body;

  try {
    const entriesObject = new DeepL.GlossaryEntries({ entries });
    const glossaryInfo = await translator.createGlossary(
      name,
      source_lang,
      target_lang,
      entriesObject
    );
    res.json(glossaryInfo);
  } catch (error) {
    next(error);
  }
});

app.get("/allglossary", async (req, res, next) => {
  const deepLApiUrl = "https://api-free.deepl.com/v2/glossaries";

  try {
    const response = await fetch(deepLApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `DeepL-Auth-Key ${deepLApiKey}`,
      },
    });

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

app.get("/glossarydetails/:glossaryId", async (req, res, next) => {
  const glossaryId = req.params.glossaryId;

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
    next(error);
  }
});

app.delete("/glossary/:glossaryId", async (req, res, next) => {
  const glossaryId = req.params.glossaryId;

  try {
    await translator.deleteGlossary(glossaryId);
    res.send("success");
  } catch (error) {
    next(error);
  }
});

app.post("/updateglossary", async (req, res, next) => {
  const { name, source_lang, target_lang, entries, editedName } = req.body;

  try {
    const existingGlossaries = await translator.listGlossaries();
    const glossary = existingGlossaries.find(
      (glossary) => glossary.name === name
    );

    await translator.deleteGlossary(glossary.glossaryId);

    const gEntries = new DeepL.GlossaryEntries({
      entries: entries.implEntries,
    });
    const glossaryInfo = await translator.createGlossary(
      editedName,
      source_lang,
      target_lang,
      gEntries
    );

    res.json(glossaryInfo);
  } catch (error) {
    next(error);
  }
});

// Use Error Handling Middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
