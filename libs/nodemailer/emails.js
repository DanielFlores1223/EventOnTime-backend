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

const sendEmailEventCancelled = async ( infObj ) => {

     const { email, nameEve, nameInv} = infObj;

     let info = await transporter.sendMail({
       from: '"Event On Time" <eventontime@eventontime.com>',
       to: email,
       subject: `Hola ${nameInv}, Evento cancelado`,
       text: '',
       html: `<p> Un gusto saludarte ${nameInv}, este correo es para informarte que se ha cancelado el evento: </p>`
     });
   
     console.log("Message sent: %s by %s", info.messageId);
}

module.exports = {
     sendEmailEvent,
     sendEmailEventCancelled
}