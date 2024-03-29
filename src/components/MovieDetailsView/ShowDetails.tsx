import { Box, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ShowDetailsEditTiles from "./ShowDetailsEditTile";
import ShowDetailsAddTile from "./ShowDetailsAddTile";
import { useEffect, useState } from "react";
import { fetchAllRooms } from "../../queries/fetchRoomAPI";
import { Movie, Room, ShowDate } from "../../interfaces/Interfaces";

interface ShowDetailsProps {
    showData: Array<ShowDate> | undefined,
    setShowData: Function,
    selectedMovie: Movie,
    getShowsByMovie: Function,
}

function ShowDetails(props: ShowDetailsProps) {

    const [roomData, setRoomData] = useState<Array<Room>>([])

    useEffect(() => {
        fetchAllRooms().then(result => setRoomData(result))
    }, [])

    const theme = useTheme();

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ p: theme.spacing(1) }}>
                        <>
                            {props.showData &&
                                <ShowDetailsEditTiles roomData={roomData} showData={props.showData} getShowsByMovie={props.getShowsByMovie} setShowData={props.setShowData} selectedMovie={props.selectedMovie} />
                            }
                            <ShowDetailsAddTile roomData={roomData} selectedMovie={props.selectedMovie} getShowsByMovie={props.getShowsByMovie} />
                        </>
                </Box>
            </LocalizationProvider>
        </>
    );
};

export default ShowDetails;

