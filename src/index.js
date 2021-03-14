const app = require('./app');
require('./connection');
async function main() {

   app.listen(process.env.PORT || 3000);
   console.log('Server is working now !')

      }


main();
