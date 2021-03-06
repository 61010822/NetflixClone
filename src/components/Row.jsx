import movieTrailer from 'movie-trailer';
import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube';
import axios from '../axios'
import '../styles/Row.css'

const base_url = "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request =  await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request
        }
        fetchData();
    },[fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
    }

    const handleClick = (movie) => {
        if(trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            }).catch(error => console.log(error))
        }
    }

  return (
    <div className="row">
        <h2 style={{color: 'white', textAlign: 'left'}}>{title}</h2>

        <div className="row-posters">
            {movies.map((data, i) => (
                <img
                className={`row-poster ${isLargeRow && "row-poster-large"}`}
                onClick={() => handleClick(data)}
                key={i} src={`${base_url}${isLargeRow ? data.poster_path : data.backdrop_path }`} alt={data.name}/>
            ))}
        </div>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  )
}

export default Row