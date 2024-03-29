import { Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import { Dayjs } from "dayjs";
import { postNewShow } from "../../queries/changeScreenings";
import Alerts from "../Alerts";
import { Movie, Room, Show } from "../../interfaces/Interfaces";

interface ShowDetailsAddTileProps {
    selectedMovie: Movie;
    roomData: Array<Room>;
    getShowsByMovie: Function;
}

function ShowDetailsAddTile(props: ShowDetailsAddTileProps) {

    const theme = useTheme();

    const [dateChanged, setDateChanged] = React.useState(false)
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [alertText, setAlertText] = React.useState("The Movie was added successfully!");
    const [addNewShow, setAddNewShow] = React.useState<Show>(
        {
            movieID: props.selectedMovie.imdbId,
            movieName: undefined,
            moviePoster: undefined,
            showID: undefined,
            roomID: undefined,
            room: undefined,
            dateTime: null,
            additionalInfo: { hasDolbyAtmos: false, isThreeD: false },
        }
    );
    function handleAddNewShow() {
        if (addNewShow.dateTime && props.selectedMovie.runtime) {
            let startTime = dateChanged ? addNewShow.dateTime : new Date(addNewShow.dateTime?.setHours(addNewShow.dateTime?.getHours() + 1))

            let payload = {
                movieId: props.selectedMovie.id,
                roomId: addNewShow.roomID,
                startDateTime: startTime,
            }
            setDateChanged(true)
            postNewShow(payload).then(result => {
                if (result.error) {
                    setAlertText(result.error);
                    setIsError(true);
                } else if (result.errorMessage) {
                    setAlertText(result.errorMessage);
                    setIsError(true);
                } else {
                    setAlertText("Show was successfully added!");
                    setIsError(false);
                    setAddNewShow(prev => ({
                        ...prev,
                        dateTime: null,
                    }));
                }
                setAlertOpen(true);
                props.getShowsByMovie();
            })
        }
    }

    const handleAddRoom = (e: SelectChangeEvent) => {
        setAddNewShow(prev => ({
            ...prev,
            roomID: e.target.value,
        }));
    }

    const handleAddDateTime = (newValue: Dayjs | null | undefined) => {
        if (newValue != null) {
            setAddNewShow(prev => ({
                ...prev,
                dateTime: newValue?.toDate(),
            }))
            setDateChanged(false);
        }
    }

    return (
        <>
            <Divider sx={{ borderBottomWidth: "0.2rem" }} />
            <Typography
                sx={{
                    ml: theme.spacing(1),
                    my: theme.spacing(1),
                }}
                variant="h6"
            >
                Add new show
            </Typography>
            <FormControl sx={{ m: theme.spacing(1) }}>
                <DateTimePicker
                    label="Show starts at"
                    value={addNewShow.dateTime}
                    onChange={(newValue: Dayjs | null) => handleAddDateTime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </FormControl>
            <FormControl
                sx={{
                    m: theme.spacing(1),
                    width: theme.spacing(15)
                }}
            >
                <InputLabel id="show-room">Room</InputLabel>
                <Select
                    id="roomID"
                    label="Room"
                    value={addNewShow.roomID}
                    onChange={(e) => handleAddRoom(e)}
                >
                    {props.roomData.map((room) => (
                        <MenuItem
                            value={room.id}
                        >
                            {room.name}
                        </MenuItem>
                    )
                    )}

                </Select>
            </FormControl>
            <Button
                variant="contained"
                fullWidth
                onClick={() => handleAddNewShow()}
                sx={{ my: theme.spacing(2) }}
                startIcon={<AddIcon />}
                disabled={(addNewShow.dateTime && addNewShow.roomID) ? false : true}
            >
                Add Show
            </Button>
            <Alerts alertOpen={alertOpen} alertText={alertText} isError={isError} setAlertOpen={setAlertOpen} />
        </>
    );
}

export default ShowDetailsAddTile;