import nodemailer from "nodemailer";

import { Email } from "./config"

async function sendEmail (to:string, subject:string, content:string) {
	if (!to&&subject&&content){
		throw "Email service error";
	} else {
		const transporter = nodemailer.createTransport({
			service: Email.service,
			auth: Email.auth
		});
		const info = await transporter.sendMail({
			from: Email.auth.user,
			to,
			subject,
			html: content
		});

		console.log("Message sent: %s", info.messageId);
	}
}

export default sendEmail
