const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.get('/posts', PostController.index);
/*
 * Nessa rota é passado o multer informando que tem apenas UM arquivo
 * que deverá ser enviado para upload
 */
routes.post('/posts', upload.single('image'), PostController.store);
routes.delete('/posts/:id', PostController.destroy);
routes.post('/posts/:id/like', LikeController.store);

module.exports = routes;