const getJsonRes = ( success = false, msg = '', result = {} || '' ) => {

     if ( success ) 
          return { success, msg, result }

     console.log( 'Error in the request: ' )
     console.log( result );
     return { success, msg }

}

module.exports = {
     getJsonRes
}