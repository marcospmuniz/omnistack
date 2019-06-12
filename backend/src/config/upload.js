// configura o comportamento do plugin multer que automatiza os uploads realizados à api.
const multer = require('multer');
const path = require('path'); // para usar caminhos no node

module.exports = {
    storage: new multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'), // equivale a ./../../uploads
        filename: function(req, file, callback) { // configura o nome que é para salvar os arquivos
            callback(null, file.originalname); // salva com o nome original do arquivo enviado
        }
    })
};