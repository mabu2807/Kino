import * as React from 'react';
import { Alert } from '@mui/material';
import { useEffect } from 'react';
import { fetchMovie, fetchTrailerFromTMDb } from '../queries/fetchOMDbAPI';
import AdminMovieDetailsView from '../components/MovieDetailsView/MovieDetailsViewAdmin';
import UserMovieDetailsView from '../components/MovieDetailsView/MovieDetailsViewUser';
import { useNavigate } from 'react-router-dom';
import { fetchSpecificMovie } from '../queries/fetchMovieAPI';
import { fetchAllScreeningsByMovie } from '../queries/fetchScreenings';
import { Movie, Show, ShowDate, ShowWithMovieObject, TrailerType } from '../interfaces/Interfaces';

interface MovieDetailsViewProps {
    selectedMovie: Movie | undefined,
    setSelectedMovie: React.Dispatch<Movie>,
    setSelectedShow: React.Dispatch<React.SetStateAction<Show | undefined>>,
    isAdmin: boolean,
    isNew: boolean,
    setIsNew: Function,
}


export const getIMDbIDFromURL = () => {
    let url = window.location.href;

    let aUrlParts = url.split("/")
    return aUrlParts[4]
}

export const sortShowsToShowDate = (input: Array<ShowWithMovieObject>) => {
    let showDate: Array<ShowDate> = [];
    input.forEach((show: ShowWithMovieObject) => {
        let isNew = true;
        if (show.startDateTime){
        let newShow: Show = {
            movieID: show.movie.id?.toString(),
            movieName: show.movie.title,
            moviePoster: show.movie.posterImage,
            dateTime: new Date(show.startDateTime),
            roomID: show.room.id.toString(),
            showID: show.id,
            additionalInfo: {
                hasDolbyAtmos: show.room.hasDolbyAtmos,
                isThreeD: show.room.hasThreeD
            },
        }
        showDate.forEach(showDate => {
            if (show.startDateTime && showDate.date.toDateString() === new Date(show.startDateTime).toDateString()) {
                showDate.shows.push(newShow)
                isNew = false
            }
        })
        if (isNew === true) {
            showDate.push({
                date: new Date(show.startDateTime),
                shows: [newShow]
            })
        }
    }
    }
    );
    return showDate;
}


function MovieDetailsView(props: MovieDetailsViewProps) {

    const [movieShows, setMovieShows] = React.useState<Array<ShowDate> | undefined>(undefined)

    const setSelectedMovie = props.setSelectedMovie;

    const navigate = useNavigate();

    const onShowTileClick = (currentShow: Show) => {
        navigate(`/showDetails/${getIMDbIDFromURL()}/${currentShow.showID}`);
        props.setSelectedShow(currentShow);
    }

    const getShowsByMovie = () => {
        fetchAllScreeningsByMovie(getIMDbIDFromURL()).then((result: Array<any>) => {
            if (result.length > 0) {
                setMovieShows(sortShowsToShowDate(result));
            }
        });
    }
    useEffect(() => {
        if (!props.isNew) {
            getShowsByMovie();
        }

        let fetchedMovie: any;

        function appendTrailer(trailers: Array<TrailerType>) {
            trailers.forEach((item: TrailerType) => {
                let selectedMovie: Movie = {
                    trailer: item.type === "Trailer" ? item : undefined,
                    actors: fetchedMovie.Actors,
                    genre: fetchedMovie.Genre,
                    imdbId: fetchedMovie.imdbID,
                    imdbRating: fetchedMovie.imdbRating,
                    imdbVotes: fetchedMovie.imdbVotes,
                    plot: fetchedMovie.Plot,
                    posterImage: fetchedMovie.Poster,
                    rated: fetchedMovie.Rated,
                    releaseYear: fetchedMovie.Year,
                    runtime: fetchedMovie.Runtime,
                    title: fetchedMovie.Title,
                    writer: fetchedMovie.Writer,
                    director: fetchedMovie.Director
                }
                if (props.isNew) {
                    setSelectedMovie(selectedMovie);
                } else {
                    setSelectedMovie({ ...fetchedMovie, trailer: item.type === "Trailer" ? item : undefined })
                }
            })
        }
        if (props.isNew) {
            fetchMovie(getIMDbIDFromURL()).then((result) => {
                fetchedMovie = result;
                fetchTrailerFromTMDb(getIMDbIDFromURL()).then((trailers) => appendTrailer(trailers.results));
            })
        } else {
            fetchSpecificMovie(getIMDbIDFromURL()).then((result) => {
                fetchedMovie = result;
                fetchTrailerFromTMDb(result.imdbId).then((trailers) => appendTrailer(trailers.results));
            })
        }
    }, [setSelectedMovie, props.isNew]);

    return (
        <>
            {!props.isAdmin && props.selectedMovie && <UserMovieDetailsView selectedMovie={props.selectedMovie} setSelectedMovie={props.setSelectedMovie} onShowTileClick={onShowTileClick} showData={movieShows} />}

            {props.isAdmin && props.selectedMovie &&
                <AdminMovieDetailsView
                    selectedMovie={props.selectedMovie}
                    setSelectedMovie={props.setSelectedMovie}
                    onShowTileClick={onShowTileClick}
                    showData={movieShows}
                    isNew={props.isNew}
                    setIsNew={props.setIsNew}
                    setShowData={setMovieShows}
                    getShowsByMovie={getShowsByMovie}
                />
            }

            {!props.selectedMovie && <Alert sx={{ marginTop: "1rem", width: "90rem", marginLeft: "2rem" }} severity="error">Currently there is no data available</Alert>}
        </>
    );
}

export default MovieDetailsView;