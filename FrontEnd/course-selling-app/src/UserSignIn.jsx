import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Card } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserState } from "./store/atoms/user";

function UserSignin() {
  const setUser = useSetRecoilState(UserState);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
                onClick={async () => {
                  const response = await axios.post(
                    "http://localhost:3000/user/login",
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
                }}
                variant="contained"
              >
                SignIn
              </Button>

              <Card variant="outlined" style={{
                display:"flex",
                justifyContent:"center",
                marginTop:15,
                padding:20
    
              }}>
                <span style={{
                    paddingRight:10
                }}>Dont have an account?</span>
                <span onClick={()=>{
                    navigate("/user/signup")

                }} style={{
                    color:"#2196f3"
                }}>Signup</span>
              </Card>
            </div>
          }
        </Card>
      </div>
    
  );
}

export default UserSignin;
