const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_KEY);

module.exports.send = function send(html,subject,to,from){

	return new Promise((resolve,reject)=>{

		sgMail.send({
			to,
			from,
			subject,
			html
		}).then(resolve).catch(reject);
				
	});
};