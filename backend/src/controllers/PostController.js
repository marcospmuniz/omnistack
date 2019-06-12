const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path'); // biblioteca padrao do node para navegação de diretorios
const fs = require('fs'); // biblioteca padrao do node para file system

module.exports = {
    
    async index(req, res) {
        const posts = await Post.find().sort('-createdAt'); // -createdAt = createdAt DESC
        return res.json(posts);
    },

    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        // separa o nome e a extensão do arquivo
        const [name, ext] = image.split('.');
        const fileName = `${name}.jpg`;

        /*
         * req.file.path = caminho completo onde a imagem foi salva
         * resize(500) = imagem terá no máximo 500px de largura ou de altura
         * jpeg({ quality: 70 }) = qualidade de compressao de 70%
         * toFile = salva para o arquivo
         * path.resolve = encontra o caminho
         * req.file.destination = o caminho até o diretório onde o req.file foi salvo
         * 
         * O método path.resolve vai concatenar todos os parametros passados para ele
         * para que se tornem um path de diretório ou arquivo. Aqui vai ficar algo como
         * /home/marcos/www/ci-smb/semana-omnistack/backend/uploads/resized/nome-da-imagem.jpg
         */ 
        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile( 
                path.resolve(req.file.destination, 'resized', fileName) 
            );

        // depois da imagem redimensionada, podemos excluir a imagem original
        fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName
        });

        // sincroniza todas as aplicações enviando os dados da insersão para todos os usuário conectados.
        req.io.emit('post', post);

        return res.json(post);
    },

    async destroy(req, res) {
        const id = req.params.id;
        const before = await Post.findOne({ _id: id });

        // tenta excluir a imagem do Post
        fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', before.image));

        before.remove(); // exclui o registro

        return res.send({ success: true });
    }

};