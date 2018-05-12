import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Route, Link } from "react-router-dom";
import MovieDetail from './MovieDetail';

class LiveMovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiData: [],
            movieDetail: [],
            castDetail: [],
            showModal: false
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    componentDidMount() {
           fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=4ed1fcc5ffc6bf4d248c44f2928822e8&language=pl-PL')
        .then(response => response.json())
        .then(data => this.setState({ apiData: data.results }));
    }

    fetchData(value){
         fetch(`https://api.themoviedb.org/3/movie/${value}?api_key=4ed1fcc5ffc6bf4d248c44f2928822e8&language=pl-PL`)
        .then(response => response.json())
        .then(data => this.setState({ movieDetail: data }));
        fetch(`https://api.themoviedb.org/3/movie/${value}/credits?api_key=4ed1fcc5ffc6bf4d248c44f2928822e8`)
        .then(response => response.json())
        .then(data => this.setState({ castDetail: data }));
    }

    render() {
        const results = this.state.apiData;
        console.log(this.state.movieDetal, this.state.castDetail)
        return (
            <React.Fragment>
                <div className="image-container">
        <ReactModal
           isOpen={this.state.showModal}
           style={{content: { overflow: 'hidden'}, overlay: {backgroundColor: 'rgba(255, 255, 255, 0.3)'}}}
           ariaHideApp={false}
           contentLabel="Movie Details Modal"
        >
        <MovieDetail {...this.state.movieDetail} {...this.state.castDetail}
                    handleClose={this.handleCloseModal} />
        </ReactModal>
                {results.map( movie =>
                    <Link key={movie.id} onClick={() => {this.fetchData(movie.id);this.handleOpenModal()}}  to={`/${movie.id}`}>
                   <img key={movie.title} src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} width="170" alt={movie.title}/>
                   </Link>
                )}
                </div>
                </React.Fragment>
            )
        }
    }


export default LiveMovies;