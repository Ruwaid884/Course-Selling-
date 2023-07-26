import { Button, Typography } from "@mui/material";
// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function AppBar({userEmail}) {
  const navigate = useNavigate();


  // useEffect(() => {
  //   function callback2(data) {
  //     if (data.username) {
  //       setUserEmail(data.username);
  //     }
  //   }
  //   function callback1(res) {
  //     res.json().then(callback2);
  //   }
  //   console.log("token - " + localStorage.getItem("token"));
    
  //   fetch("http://localhost:3000/admin/me", {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + localStorage.getItem("token"),
  //     },
  //   }).then(callback1);
  // }, []);

  if (userEmail) {
    return <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Typography  onClick={()=>{
        navigate("/");
      }} variant="h5"> INFINIX</Typography>
      </div>

      <div style={{display: "flex"}}>
                <div style={{marginRight: 10, display: "flex"}}>
                <div style={{marginRight: 10}}>
                        <Button
                            onClick={() => {
                                navigate("/addcourse")
                            }}
                        >Add course</Button>
                    </div>

                    <div style={{marginRight: 10}}>
                        <Button
                            onClick={() => {
                                navigate("/courses")
                            }}
                        >Courses</Button>
                    </div>

                    <Button
                        variant={"contained"}
                        onClick={() => {
                            localStorage.setItem("token", null);
                            window.location = "/";
                        }}
                    >Logout</Button>
                </div>
            </div>
        </div>
  }

  return (
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
        <div
          style={{
            marginRight: 5,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              navigate("/signup");
            }}
          >
            SignUp
          </Button>
        </div>

        <Button
          variant="contained"
          onClick={() => {
            navigate("/signin");
          }}
        >
          SignIn
        </Button>
      </div>
    </div>
  );
}
export default AppBar;
