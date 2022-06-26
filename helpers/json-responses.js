const getJsonRes = ( success = false, msg = '', result = {} || [] ) => {

     if ( success ) 
          return { success, msg, result }

     console.log( 'Error in the request' );
     
     if( typeof result !== 'object' && !Array.isArray( result ) )
          return { success, msg }
                    
     if ( result.errors && Array.isArray( result.errors ) )
          return { success, msg, errors: result.errors }
     
     if( typeof result === 'object' && Object.keys( result ) > 0 ) 
          return { success, msg, errors: result }

     return { success, msg }     
}

module.exports = {
     getJsonRes
}