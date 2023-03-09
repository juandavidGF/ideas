const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY_SENDGRID);

export default async function handler(req, res) {

	if(req.method == "POST") {
		const { email, appName } = req.body;

		console.log('handler#email', email);
		console.log('handler#appName', appName);

		const txt = `${email} have suscribed to ${appName}`
		const subject = `${appName} | ${email}`;

		const msg = {
			to: 'juanchoda12@gmail.com', // Recipent
			from: 'support@artmelon.me', // Verified sender
			subject: subject,
			text: txt,
			html: `<strong>${txt}</strong>`,
		}
		let response = null;

		try {
			response = await sgMail.send(msg);
			res.status(200).json({ success: 'Ok' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal server error' });
		}

	} else {
		res.status(400).json({ error: 'Bad request' });
	}
}
