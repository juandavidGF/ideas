
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY_SENDGRID);


export default async function handler(req, res) {

	let response;

	if(req.method == "POST") {
		const { key, name, email} = req.body;

		if(key==="goToPay") {
			const txt = `name: ${name}, email" ${email} , have clicked the ${key} button`
			const subject = `${key} - ${name}`;

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

			console.log("flag2")

			res.status(200).json(response);
		}
	} else {
		console.log("isn't a post");
		const msg = {
			to: 'juanchoda12@gmail.com', // Change to your recipient
			from: 'support@artmelon.me', // Change to your verified sender
			subject: 'Sending with SendGrid is Fun',
			text: 'and easy to do anywhere, even with Node.js',
			html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		}

		console.log("flag3")

		try {
			response = await sgMail.send(msg);
		} catch (error) {
			console.error(error);
		}

		// console.log(response);

		res.status(200).json(response);
	}

}