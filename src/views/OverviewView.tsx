import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminProps } from '../App';
import TileBar from '../components/OverviewView/Tilebar';
import AddIcon from '@mui/icons-material/Add';

function OverviewView(adminProp: AdminProps) {

    const navigate = useNavigate();

    const handleButtonCklick = (
        link: String,
    ) => {
        navigate(`/${link}`);
    };

    const theme = useTheme();

    return (
        <div>
            <TileBar title='Star Wars' query='Star Wars' />
            <TileBar title='Marvel' query='Marvel' />
            <TileBar title='Harry Potter' query='Harry Potter' />
            {adminProp.isAdmin &&
                <Box textAlign = 'center' sx={{ p: theme.spacing(3) }}>
                    <Button
                        variant='contained'
                        onClick={() => handleButtonCklick("addNewMovie")}
                        startIcon={<AddIcon />}
                    >
                        Add new Movie
                    </Button>
                </Box>
            }
        </div>
    );
}


export default OverviewView;


