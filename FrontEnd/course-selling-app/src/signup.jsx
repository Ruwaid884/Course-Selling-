import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Card, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup({setUserEmail}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
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
          {" "}
          <Typography variant={"h6"}>
            Welcome to the Infinix... signup below
          </Typography>
        </div>
      </div>
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
          }}
          variant="outlined"
        >
          {
            <div>
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
                variant="contained"
                onClick={async()=>{
                    const response = await axios.post("http://localhost:3000/admin/signup", {
                        username: email,
                        password: password
                    }, {
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
            
                    const data = response.data;
                    localStorage.setItem("token",data.token);
                    setUserEmail(email);
                    navigate("/");
                                }}
              >
                SignUp
              </Button>
            </div>
          }
        </Card>
      </div>
    </div>
  );
}

export default Signup;
