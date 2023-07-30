import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import { useRecoilValue } from "recoil";
import {EmailState, userEmailState} from "./store/selectors/userEmailState";




export const Landing = () => {
    const userEmail = useRecoilValue(userEmailState);
    const Email = useRecoilValue(EmailState);
    const navigate = useNavigate()
    return <div>
        <Grid container style={{padding: "5vw"}}>
            <Grid item xs={12} md={6} lg={6}>
                <div style={{marginTop: 100}}>
                 <Grid item xs={12} md={6} lg={6}>
                   <img style={{
                    width:150,
                    height:80
                   }} src={"https://bl-i.thgim.com/public/news/7gk5z8/article65615786.ece/alternates/FREE_1200/infinix.jpg"}  />
                  </Grid> 
                  <Typography variant={"h5"}>
                        A place to learn, earn and grow
                    </Typography>
                   { !(userEmail || Email) && <div style={{display: "flex", marginTop: 20}}>
                    <div style={{ display:"flex",flexWrap:"wrap"}}>
                    <Button style={{marginRight: 10,
                    marginBottom:5,
                     display:"flex",
                     flexWrap:"wrap",
                     background:"#050505",
                     height:40,width:40,
                     justifyContent:"center"}}
                                size={"large"}
                                variant={"contained"}
                                onClick={() => {
                                    navigate("/user/signin")
                                }}
                            >USER</Button>
                        
                        <Button style={{background:"#050505",marginRight: 10,marginBottom:5, display:"flex",flexWrap:"wrap",height:40,width:40,justifyContent:"center"}}
                      
                                size={"large"}
                                variant={"contained"}
                                onClick={() => {
                                    navigate("/admin/signin")
                                }}
                            >ADMIN</Button>


                    </div>
                           
                        </div>
                    }
                </div>
                <div>
                </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}  style={{marginTop: 30}}>
                <img src={"https://s3-us-east-2.amazonaws.com/maryville/wp-content/uploads/2019/11/26125927/programmers-discussing-code-1.jpg"} width={"100%"} />
            </Grid>
        </Grid>
    </div>
}