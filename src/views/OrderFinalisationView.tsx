import { Box, Button, Card, Grid, Typography, useTheme } from "@mui/material";
import { User } from "../components/PaymentDetailsView/PersonalDataGuestUser";
import { Order } from "./PaymentDetailsView";
import { useEffect } from "react";
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import OrderOverview from "../components/PaymentDetailsView/OrderOverview";
import QRCode from "react-qr-code";
import DownloadIcon from '@mui/icons-material/Download';
import { Movie } from "./MovieDetailsView";
import { Show } from "../components/MovieDetailsView/ShowTiles";
import { getMovieAfterReload, getShowAfterReload } from "./TicketView";

interface OrderFinalisationViewProps {
    order: Order | undefined;
    setOrder: React.Dispatch<React.SetStateAction<Order | undefined>>;
    user: User;
    setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | undefined>>;
    selectedMovie: Movie | undefined;
    setSelectedShow: React.Dispatch<React.SetStateAction<Show | undefined>>;
    selectedShow: Show | undefined;
}

function OrderFinalisationView(props: OrderFinalisationViewProps) {

    const theme = useTheme();

    const printRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

    const setSelectedShow = props.setSelectedShow;
    const setSelectedMovie = props.setSelectedMovie;
    const setOrder = props.setOrder;

    useEffect(() => {
        if (props.order === undefined) {
            let url = window.location.href;

            let aUrlParts = url.split("/")
            let initialOrder: Order = {
                orderID: aUrlParts[6],
                price: undefined,
                fares: undefined,
                seats: undefined
            }
            setOrder(initialOrder)
        }
        getShowAfterReload().then(result => setSelectedShow(result))
        getMovieAfterReload().then(result => setSelectedMovie(result));
    }, [setSelectedShow, setSelectedMovie, setOrder, props.order])

    async function handleDownloadPDF() {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            format: 'a4',
            unit: 'px',
            orientation: "landscape"
        });
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Cinetastisch_Order_${props.order?.orderID}.pdf`);
    }

    return (
        <>
            {props.order && props.selectedMovie && props.selectedShow && (
                <div ref={printRef}>
                    <Box sx={{ flexGrow: 1, p: theme.spacing(3) }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={6} xl={6}>
                                <>
                                    <Box sx={{ py: theme.spacing(3), textAlign: "center", textJustify: "center", }}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                py: theme.spacing(3),
                                                paddingLeft: theme.spacing(1)
                                            }}
                                        >
                                            Thank you for your Order!
                                        </Typography>
                                        <Typography variant="body1">
                                            We will send you an email with the tickets and the invoice soon.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Box sx={{ py: theme.spacing(3), textAlign: "center", textJustify: "center", }}>
                                        <Typography variant="body1" sx={{ pb: theme.spacing(2) }}>
                                            Below you can find the QR-Code with your order.
                                        </Typography>
                                        <QRCode value={props.order?.orderID} size={150} />
                                        <Typography sx={{ pt: theme.spacing(2) }}>Order-ID: {props.order?.orderID}</Typography>
                                    </Box>
                                    <Box sx={{ p: theme.spacing(2), textAlign: "center", textJustify: "center", }}>
                                        <Button
                                            onClick={handleDownloadPDF}
                                            startIcon={<DownloadIcon />}
                                        >
                                            Download Page
                                        </Button>
                                    </Box>
                                </>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} xl={6}>
                                <>
                                    <Card >
                                        <OrderOverview
                                            orderID={props.order.orderID}
                                            movieID={props.selectedMovie.id}
                                            showID={props.selectedShow.showID}
                                            movie={props.selectedMovie.title}
                                            picture={props.selectedMovie.posterImage}
                                            showDate={props.selectedShow.dateTime}
                                            room={props.selectedShow.room}
                                            seats={props.order.seats}
                                            fares={props.order.fares}
                                            price={props.order.price}
                                        />
                                    </Card>
                                </>

                            </Grid>
                        </Grid>
                    </Box>
                </div >
            )}
        </>
    );
}

export default OrderFinalisationView;