import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import {Box, Container, Grid, IconButton, Typography} from "@mui/material";
import {Link} from "react-router-dom";


const Footer = ()=>{
    return(
    <Box sx={{ bgcolor: '#20b486', color: 'white', py: 6, width:"100%" }}>
            <Container>
                <Grid container spacing={4}  justifyContent={"space-between"}>
                    <Grid item xs={12} sm={12} lg={4}>
                        <Typography variant="h6" gutterBottom>
                            About us
                        </Typography>
                        <Typography variant="body2">
                            This Website is dedicated to create amazing learning experiences. The mission is to deliver high-quality, responsive, and user-friendly applications.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <Typography variant="h6" gutterBottom >
                            Quick Links
                        </Typography>
                        <Link href="#" color="inherit" variant="body2" display="block" style={{marginRight:"10px"}} >
                            Home
                        </Link>
                        <Link href="#" color="inherit" variant="body2" display="block" style={{margin:"10px"}} >
                            Services
                        </Link>
                        <Link href="#" color="inherit" variant="body2" display="block" style={{margin:"10px"}} >
                            Blog
                        </Link>
                        <Link href="#" color="inherit" variant="body2" display="block" style={{margin:"10px"}} >
                            Contact
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2">
                            Email:syedruwaid32@gmail.com
                        </Typography>
                        <Typography variant="body2">
                            Phone: +91 9149978884
                        </Typography>
                        <Box mt={2}>
                            <IconButton href="#" color="inherit">
                                <Facebook />
                            </IconButton>
                            <IconButton href="#" color="inherit">
                                <Twitter />
                            </IconButton>
                            <IconButton href="#" color="inherit">
                                <Instagram />
                            </IconButton>
                            <IconButton href="#" color="inherit">
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Box mt={4} textAlign="center">
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Infinix. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer;
