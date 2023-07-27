import { Button, Typography } from "@mui/material";
// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue,useSetRecoilState } from "recoil";
import {userEmailState} from "./store/selectors/userEmailState";
import {userLoadingState} from "./store/selectors/userLoadingState";
import { userState } from "./store/atoms/user";


function AppBar() {
  const navigate = useNavigate();
  const userLoading = useRecoilValue(userLoadingState);
  const userEmail = useRecoilValue(userEmailState);
  const setUser = useSetRecoilState(userState); 

  if(userLoading){
    return <div></div>
  }


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
                          setUser({
                            isLoading:false,
                            userEmail:null
                          })
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
