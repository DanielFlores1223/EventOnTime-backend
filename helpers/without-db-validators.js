const { CollectionsForImagesEnum } = require('../helpers/enums');


/* IMPORTANT: All the custom validations for using in express-validator have to be async */

/* 
     This function searchs in the enum of available collections for the user can insert an image.
*/
const isValidCollection = async ( collection = '' ) => {

     let isValid = false;

     for (const key in CollectionsForImagesEnum) {
         if ( String( key ) == collection )
           isValid = true;
     }

     if ( !isValid ) 
          throw new Error(`La colección que ingresaste no está permitida`);
}

module.exports = {
     isValidCollection,
}