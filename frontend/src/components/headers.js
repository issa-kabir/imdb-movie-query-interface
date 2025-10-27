import React from 'react'
import { Paper, Typography } from '@mui/material'

const Headers = () => {
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 1 }}>
            <Typography variant="h5" component="h1" align="center">
                IMDB top 1000 Movies
            </Typography>
        </Paper>
    )
}

export default Headers;