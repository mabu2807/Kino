import React from "react";
import { styled, Theme, CSSObject, useTheme } from "@mui/material/styles";
import { Typography, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import { useNavigate } from "react-router-dom";
import PaidIcon from '@mui/icons-material/Paid';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MovieIcon from '@mui/icons-material/Movie';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AppBarProps, drawerWidth } from "./Header";
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import AddHomeIcon from '@mui/icons-material/AddHome';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.down('sm')]: {
    width: 0,
  },
  backgroundColor: theme.palette.primary.main,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface SideMenuProps {
  isAdmin: boolean;
  appBarProps: AppBarProps;
}

function SideMenu(props: SideMenuProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const theme = useTheme();

  function createMenuData(
    index: number,
    label: String,
    link: String,
    icon: JSX.Element,
    onlyAdmin: boolean,
  ) {
    return { index, label, link, icon, onlyAdmin }
  }

  const menuData = [
    createMenuData(1, 'Movies', '', <MovieIcon />, false),
    createMenuData(2, 'Shows', 'shows', <SlideshowIcon />, false),
    createMenuData(3, 'Opening hours', 'openingHours', <AccessTimeIcon />, false),
    createMenuData(4, 'Price Categories', 'ticketPrices', <PaidIcon />, false),
    createMenuData(5, 'Getting here', 'gettingHere', <AssistantDirectionIcon />, false),
    createMenuData(6, 'Rooms', 'rooms', <AddHomeIcon />, true),
  ];

  const navigate = useNavigate();

  const handleListItemClick = (
    link: String,
    index: number,
  ) => {
    setSelectedIndex(index);
    navigate(`/${link}`);
    props.appBarProps.handleMenuClose();
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={props.appBarProps.open}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <DrawerHeader>
        <Typography
          variant="h5"
          align="left"
          sx={{ color: theme.palette.primary.contrastText }}
        >
          Navigation
        </Typography>
        <IconButton
          onClick={() => props.appBarProps.handleMenuClose()}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuData.map((item) => (
          <>
            {
              ((props.isAdmin && item.onlyAdmin) ||  !item.onlyAdmin) &&
              < ListItem key={item.index} disablePadding>
                <ListItemButton
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#871313",
                    },
                  }}
                  selected={selectedIndex === item.index}
                  onClick={() => handleListItemClick(item.link, item.index)}
                >
                  <ListItemIcon
                    sx={{ color: theme.palette.primary.contrastText }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: theme.palette.primary.contrastText }}
                    primary={item.label}
                  />
                </ListItemButton>
              </ListItem>
            }
          </>
        ))}
      </List>
    </Drawer >
  );
}

export default SideMenu;