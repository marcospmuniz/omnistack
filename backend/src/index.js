const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

global.gConfig = require('./config/global.json');

const app = express();

// as 2 linhas abaixo configura a aplica para ouvir tando HTTP quanto WEBSOCKET na const server
const server = require('http').Server(app);
const io = require('socket.io')(server); // permite receber e enviar requisições para todos os usuário conectadods da aplicação através de websocket

// Conexão ao banco de dados que criei no mongo Atlas
mongoose.connect(global.gConfig.db.mongo.connectionString, {
    useNewUrlParser: true,
});

// criamos aqui uma middleware para compartilhar o const io com todas as requisições/rotas
// que vierem logo depois desta declaração, tornando assim possível acessar req.io
// dentro de todas as requisições.

app.use((req, res, next) => {
    req.io = io;
    next();
});

// liberando acesso à api de qualquer origem Access-Control-Allow-Origin:*
app.use(cors());

// sempre que acessarmos a rota /files será acessado o diretório onde a imagens estão
// isto torna possível chamar as imagens na aplicação com um src="/files/nome-da-imagem.jpg"
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

// rotas
app.use(require('./routes'));

// pode ser qualquer porta, não é recomendando usar a porta 80 para o desenvolvimento do backend
server.listen(3333);