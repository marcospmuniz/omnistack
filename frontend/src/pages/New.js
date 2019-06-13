import React, { Component } from 'react';
import api from '../services/api';

import './New.css';

class New extends Component {

    constructor(props) {

        super(props);

        this.state = {
            image: null,
            author: '',
            place: '',
            description: '',
            hashtags: ''
        }

        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleImageChange = function(e) {
        this.setState({ image: e.target.files[0] });
    }

    handleChange = function(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = async function(e) {
        e.preventDefault();
        
        // como este formulário é enviado para api como um multipart-formdata, ele precisa
        // ser enviado da forma abaixo, e não como um json puro
        const data = new FormData();

        data.append('image', this.state.image);
        data.append('author', this.state.author);
        data.append('place', this.state.place);
        data.append('description', this.state.description);
        data.append('hashtags', this.state.hashtags);

        await api.post('posts', data);

        // redireciona o acesso para a rota /
        this.props.history.push('/');

    }

    render() {
        return (
            <form id="new-post" onSubmit={this.handleSubmit}>
                <input type="file" onChange={this.handleImageChange} />

                <input 
                type="text" 
                name="author"
                placeholder="Autor do post"
                onChange={this.handleChange}
                value={this.state.author}
                />

                <input 
                type="text" 
                name="place"
                placeholder="Local do post"
                onChange={this.handleChange}
                value={this.state.place}
                />

                <input 
                type="text" 
                name="description"
                placeholder="Descrição do post"
                onChange={this.handleChange}
                value={this.state.description}
                />

                <input 
                type="text" 
                name="hashtags"
                placeholder="Hashtags do post"
                onChange={this.handleChange}
                value={this.state.hashtags}
                />

                <button type="submit">Enviar</button>
            </form>
        );
    }

}

export default New;