// PAREI NO MINUTO 38:10

import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

class Feed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            feed: []
        }

        this.handleLike = this.handleLike.bind(this);
        this.registerToSocket = this.registerToSocket.bind(this);

    }

    async componentDidMount() {

        // registra o websocket para atualização real-time
        this.registerToSocket();

        const response = await api.get('/posts');
        this.setState({ feed: response.data });
    }

    registerToSocket = function() {
        const socket = io('http://localhost:3333');

        // post, like

        socket.on('post', function(newPost) {
            // aqui eu pego o novo post e coloco ele no inicio feed já existente 
            // no this.state.feed e seto o valor do state.feed agora com o novo post no inicio
            this.setState({ feed: [newPost, ...this.state.feed] });
        });

        socket.on('like', likedPost => {
            // aqui, para atualizar a quantidade de likes de uma postagem que recebeu um novo
            // like em tempo real eu precorro todas as postagens do feed procurando pela postagem
            // com o _id da postagem que recebeu o like, quando encontro, eu atualizo o state dessa
            // postagem especifica pelo valor da postagem que recebeu o like para alterar na tela 
            // a quantidade de likes dela.
            this.setState({
                feed: this.state.feed.map(post => {
                    return post._id === likedPost._id ? likedPost : post
                })
            });
        });
    }

    handleLike = function(id) {
        api.post(`/posts/${id}/like`);
    }

    render() {
        return (
            <section id="post-list">

                {
                    this.state.feed.map(post => (
                        <article key={post._id}>

                            <header>
                                <div className="user-info">
                                    <span>{post.author}</span>
                                    <span className="place">{post.place}</span>
                                </div>

                                <img src={more} alt="Mostrar mais" />
                            </header>

                            <img src={`http://localhost:3333/files/${post.image}`} alt="" />

                            <footer>
                                <div className="actions">
                                    {/* Para conseguir passar parametro em função (this.handleLike(post._id)) se que a
                                    função seja executada ao ser renderizada, basta passar a função como retorno
                                    de outra função, como no exemplo abaixo onde isso é feito usando arrow function */}
                                    <button type="button" onClick={() => this.handleLike(post._id) }>
                                        <img src={like} alt="Curtir" />
                                    </button>
                                    <img src={comment} alt="Comentar" />
                                    <img src={send} alt="Enviar" />
                                </div>

                                <strong>{post.likes} Curtidas</strong>
                                <p>
                                    {post.description}
                                    <span>
                                        {post.hashtags}
                                    </span>
                                </p>
                            </footer>

                            </article>
                    ))
                }

                
            </section>
        );
    }

}

export default Feed;