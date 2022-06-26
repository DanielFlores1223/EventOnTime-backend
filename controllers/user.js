// TODO: Add picture in methods

const { request, response } = require('express');
const { getJsonRes } = require('../helpers/json-responses');
const bcryptjs = require('bcryptjs')
const { User } = require('../models');

const create = async ( req = request, res = response ) => {
     try {
          const { name, email, password, status, account, role } = req.body;

          const user = new User( { name, email, password, status, account, role } );

          // Encrypting user password
          const salt = bcryptjs.genSaltSync();
          user.password = bcryptjs.hashSync(password, salt);

          await user.save();

          res.status( 201 ).json( getJsonRes( true, ` Bienvenido ${user.name} a Event on Time`, user ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}


module.exports = {
     create,

}