import { Button, Typography } from "@mui/material"
import { useState } from "react";
import {useNavigate} from "react-router-dom";

function AppBar(){
    const navigate = useNavigate()
    const [userEmail,setUserEmail]= useState(null);

    if(userEmail){
        <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h5"> INFINIX</Typography>
        </div>
        <div style={{ display: "flex" }}>
          <div>{userEmail}</div>
          <div
            style={{
              marginRight: 5,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                localStorage.setItem("token", null);
                window.location = "/";
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

    }
return <div
style={{
    display:"flex",
    justifyContent:"space-between"
}}>
<div>
<Typography variant="h5"> INFINIX</Typography>
</div>
<div style={{ display:"flex"}}>
    <div style={{
        marginRight:5
    }}>
        
 <Button 
 variant="contained"
  onClick={() => {
    navigate("/signup")
}}
>SignUp</Button></div>

<Button 
variant="contained"
 onClick={() => {
    navigate("/signin")
}}
>SignIn</Button>
</div>



</div>
}
export default AppBar