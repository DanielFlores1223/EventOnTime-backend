const fs = require('fs');

const deleteFiles = ( files = [] ) => {
     for (let i = 0; i < files.length; i++) {
          const file = files[i];
          fs.unlinkSync(file.path);
     }
}


module.exports = {
     deleteFiles,
}