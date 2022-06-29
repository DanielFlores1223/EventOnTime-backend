const { Picture } = require('../models');
const { getJsonRes } = require('../helpers');
const { request, response } = require('express');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create = async ( req = request, res = response ) => {

     const { files } = req;
     const { collection, id } = req.params;
     let result = [];

     for( let i = 0; i < files.length; i++ ) {
          
          try {
               const filePathInCloudinary = `${files[i].path}`;

               const uploaded = await cloudinary.uploader.upload( files[i].path, { url: filePathInCloudinary } );

               const data = {
                    url: uploaded.secure_url,
                    name: files[i].filename,
                    document: id,
                    collectionDB: collection
               }

               const pictureNew = new Picture( data );
               await pictureNew.save();
               result = [ ...result, pictureNew ];

               fs.unlinkSync( files[i].path );
               
          } catch (error) {
               console.log(error);
               fs.unlinkSync( files[i].path );             
               throw new Error('Algo salio mál al intentar subir los archivos');
          }
          
     }

     res.status(201).json( getJsonRes( true, 'Las imagenes se guardaron correctamente', result ) );
}

module.exports = {
     create,
}