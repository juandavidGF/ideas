const axios = require('axios');
const FormData = require('form-data');

const apiKey = process.env["API_KEY_YT_TRANSCRIPTION"]
const endpoint = process.env["ENPOINT_VIDEO_2_TEXT"]

export default async function handler(req, res) {
	const { body, method } = req;

	if(method == "POST") {
		try {
			const form = new FormData();
			form.append('audio_url', body.link);
			form.append('language', 'english');
			form.append('language_behaviour', 'automatic single language');
			form.append('output_format', 'json');

			console.log('handler#form', form)
			const response = await axios.post(
				endpoint,
					form,
					{
						headers: {
							...form.getHeaders(),
							'accept': 'application/json',
							'x-gladia-key': apiKey,
							'Content-Type': 'multipart/form-data'
						}
					}
			);
			console.log('handler#response', response.data);
			console.log('handler#response', response.message);
			return res.status(200).json({ transcription: response });
		} catch (error) {
			console.log('handler#err', error);
			return res.status(500);
		}
	}
}
