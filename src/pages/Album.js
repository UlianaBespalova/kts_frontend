import React, {useEffect, useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

//получает либо объект, либо функцию
const useStyles = makeStyles((theme) => ({
    //фигачим стили
    //для тегов???
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));


function createData(title, number, delta) {
    return { title, number, delta };
}

const titles = [
    "Всего",
    "Выздоровело",
    "Погибло",
    "Летальность",
    "Ещё что-то",
    "Иещё"
];

const myMock = {
    'cases': 100000,
    'recovered': 10000,
    'deaths': 1,
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //количество

export default function Album() {

    const [data, setData] = useState([
        createData(titles[0], myMock.cases, 55),
        createData(titles[1], myMock.recovered, 55),
        createData(titles[2], myMock.deaths, 55),
        createData(titles[3], 0, 55),
        createData(titles[4], 0, 55),
        createData(titles[5], 0, 55),
    ]);



    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Сквозняк
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>

                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h6" variant="h6" align="center" color="textPrimary" gutterBottom>
                            Коронавирус в мире
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary">
                                        Кнопка яркая
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary">
                                        Кнопка неяркая
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>

                <Container className={classes.cardGrid} maxWidth="md">

                    <Grid container spacing={4}>
                        {data.map((item) => (

                            <Grid item  xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {item.title}
                                        </Typography>
                                        <Typography>
                                            {item.number}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            кнопка
                                        </Button>
                                        <Button size="small" color="primary">
                                            кнопка
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>

            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Something here to give the footer a purpose!
                </Typography>
                <Copyright />
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}
