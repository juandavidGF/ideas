const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY_SENDGRID);

export default async function handler(req, res) {

	if(req.method == "POST") {
		const { email} = req.body;

		const txt = `${email} have suscribed to the HN Digest newsletter`
		const subject = `HN - fast  ${email}`;

		const msg = {
			to: 'juanchoda12@gmail.com', // Recipent
			from: 'support@artmelon.me', // Verified sender
			subject: subject,
			text: txt,
			html: `<strong>${txt}</strong>`,
		}

		try {
			response = await sgMail.send(msg);
		} catch (error) {
			console.error(error);
		}

		res.status(200).json(response);
	}
  res.status(200).json({ name: 'John Doe' })
}
