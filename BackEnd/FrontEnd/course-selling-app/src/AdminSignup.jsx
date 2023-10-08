import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import { Card } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSetRecoilState } from "recoil";
import { adminState } from "./store/atoms/user";

function AdminSignup() {
  const setUser = useSetRecoilState(adminState);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);



  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/signup",
        {
          username: email,
          password: password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      let data = response.data;
      localStorage.setItem("token", data.token);
      setUser({
        isLoading: false,
        userEmail: email,
      });
      navigate("/");
    } catch (error) {
      console.log("Error signing in: ", error);
      if(password.length<6)
      setError(" password length must be between 6 to 15");
    else 
    setError("Username already exists");
    }
  };



  return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            width: 300,
            padding: 20,
            marginTop: 50,
          }}
          variant="outlined"
        >
          {
            <div>
              <div
                style={{
                  paddingTop: 15,
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div>
                <img onClick={()=>{
                    navigate("/")
                  }}
                    width={130}
                    height={130}
                    src="https://static.vecteezy.com/system/resources/previews/014/441/310/non_2x/infinity-icon-3d-design-for-application-and-website-presentation-png.png"
                  ></img>
                </div>
              </div>

              <TextField
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                fullWidth={true}
                id="outlined-basic"
                label="Username"
                variant="outlined"
              />
              <br></br>
              <div style={{ marginTop: 10 }}>
                <TextField
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  fullWidth={true}
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  type="password"
                />
              </div>
              <br></br>
              <Button
               onClick={handleSignUp}
               fullWidth
               variant="contained"
               color="primary"
               size="large"
               style={{ marginTop: 20 }}
             >
                Signup
              </Button>

              {error && (
          <Typography color="error" variant="body2" style={{ marginTop: 10, textAlign: "center" }}>
            {error}
          </Typography>
        )}



              <Card variant="outlined" style={{
                display:"flex",
                justifyContent:"center",
                marginTop:15,
                padding:20
    
              }}>
                <span style={{
                    paddingRight:10
                }}>Already registered?</span>
                <span onClick={()=>{
        navigate("/admin/signin");
      }}  style={{
                    color:"#2196f3"
                }}>Signin</span>
              </Card>
            </div>
          }
        </Card>
      </div>
    
  );
}

export default AdminSignup;
