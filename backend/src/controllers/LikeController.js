const Post = require('../models/Post');

module.exports = {

    async store(req, res) {

        const post = await Post.findById(req.params.id);

        post.likes += 1;

        await post.save();

        // sincroniza todas as aplicações enviando os dados do like para todos os usuário conectados
        req.io.emit('like', post);

        return res.json(post);
    }

};