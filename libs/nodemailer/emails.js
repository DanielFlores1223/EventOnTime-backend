const { transporter } = require('./config');

const sendEmailEvent = async ( infObj ) => {

     const { email, codeInv, codeEve, nameEve, nameInv, } = infObj;

     let info = await transporter.sendMail({
       from: '"Event On Time" <eventontime@eventontime.com>',
       to: email,
       subject: `Hola ${nameInv}, te han invitado a un evento`,
       text: '',
       html: `<p> Un gusto saludarte ${nameInv}, has sido invitado a un evento </p>
              <p> <bold>Evento: </bold>${ nameEve } </p>
              <h5>Credenciales para ver la inivitación en la app móvil</h5>
              <p> <bold>Código evento: </bold>${ codeEve } </p>
              <p> <bold>Código invitado: </bold>${ codeInv } </p>
              <a href="https://eventontime.netlify.app">Desgarga app móvil aquí</a>
             `
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