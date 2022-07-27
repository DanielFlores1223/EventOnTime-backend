const { transporter } = require('./config');

const sendEmailEvent = async ( infObj ) => {

     const { email, codeInv, codeEve, nameEve, nameInv, } = infObj;

     let info = await transporter.sendMail({
       from: '"Event On Time" <eventontime@eventontime.com>',
       to: email,
       subject: `Hola ${nameInv}, te han invitado a un evento`,
       text: '',
       html: `<p> Un gusto saludarte ${nameInv} </p>`
     });
   
     console.log("Message sent: %s by %s", info.messageId);
}

module.exports = {
     sendEmailEvent,
}