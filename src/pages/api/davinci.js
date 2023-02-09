const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


export default async function handler(req, res) {
	const { body, method } = req;

	if(method == "POST") {
		console.log('body.prompt', body.prompt)
		// const completion = await openai.createCompletion({
		// 	model: "text-davinci-002",
		// 	prompt: body.prompt,
		// });
		// console.log('davinci#text', completion.data.choices[0].text);
		// res.status(200).json({ message: completion.data.choices[0].text });
		res.status(200).json({ test: 'ok' });
	}
}