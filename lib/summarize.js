const { AzureKeyCredential, TextAnalysisClient } = require("@azure/ai-language-text");

const endpoint = process.env["ENDPOINT_AZURE"] || "<paste-your-endpoint-here>";
const apiKey = process.env["LANGUAGE_API_KEY"] || "<paste-your-key-here>";


const main = async (documents, maxSentenceCount) => {
  console.log("== Extractive Summarization Sample ==");


  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const actions = [
    {
      kind: "ExtractiveSummarization",
      maxSentenceCount: maxSentenceCount,
    },
  ];
  const poller = await client.beginAnalyzeBatch(actions, documents, "en");

  poller.onProgress(() => {
    console.log(
      `Last time the operation was updated was on: ${poller.getOperationState().modifiedOn}`
    );
  });
  console.log(`The operation was created on ${poller.getOperationState().createdOn}`);
  console.log(`The operation results will expire on ${poller.getOperationState().expiresOn}`);

  const results = await poller.pollUntilDone();

  for await (const actionResult of results) {
    if (actionResult.kind !== "ExtractiveSummarization") {
      throw new Error(`Expected abstractive summarization results but got: ${actionResult.kind}`);
    }
    if (actionResult.error) {
      const { code, message } = actionResult.error;
      throw new Error(`Unexpected error (${code}): ${message}`);
    }
    for (const result of actionResult.results) {
      console.log(`- Document ${result.id}`);
      if (result.error) {
        const { code, message } = result.error;
        throw new Error(`Unexpected error (${code}): ${message}`);
      }
			const summary = result.sentences.map((sentence) => sentence.text).join("\n");
			return summary;
    }
  }
}

// main().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });
export default main;
// exports.main = main;