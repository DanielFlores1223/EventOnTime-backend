const { transporter } = require('./config');

const sendEmailEvent = async ( infObj ) => {

     const { email, codeInv, codeEve, nameEve, nameInv, } = infObj;

     let info = await transporter.sendMail({
       from: '"Event On Time" <eventontime@eventontime.com>',
       to: email,
       subject: `Hola ${nameInv}, te han invitado a un evento`,
       text: '',
       html: `<p> Un gusto saludarte ${nameInv}, has sido invitado a un evento </p>
              <p> <span style="font-weight: bold;">Evento: </span>${ nameEve } </p>
              <h3>Credenciales para ver la inivitación en la app móvil</h3>
              <p> <span style="font-weight: bold;>Código evento: </span>${ codeEve } </p>
              <p> <span style="font-weight: bold;>Código invitado: </span>${ codeInv } </p>
              <p>Para poder ver la invitación es necesario tener la aplicación móvil en tu dispositivo :)</p>
              <a href="https://eventontime.netlify.app">Descarga app móvil aquí</a>
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
       html: `<p> Un gusto saludarte ${nameInv}, este correo es para informarte que se ha cancelado el evento: ${nameEve}. </p>
       
          <p> Muchas gracias por su atención. </p>
          <p> Saludos. </p>
       `
     });
   
     console.log("Message sent: %s by %s", info.messageId);
}

module.exports = {
     sendEmailEvent,
     sendEmailEventCancelled
}