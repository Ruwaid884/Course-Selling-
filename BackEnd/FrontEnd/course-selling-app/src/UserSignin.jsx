import TextField from "@mui/material/TextField";
import { Button, Card,Typography } from "@mui/material";
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
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
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
    } catch (error) {
      console.log("Error signing in: ", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        style={{
          width: 320,
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
        }}
        variant="outlined"
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            onClick={() => {
              navigate("/");
            }}
            width={100}
            height={100}
            src="https://static.vecteezy.com/system/resources/previews/014/441/310/non_2x/infinity-icon-3d-design-for-application-and-website-presentation-png.png"
            alt="Infinity Logo"
          />
        </div>

        <TextField
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          fullWidth
          id="outlined-basic"
          label="Username"
          variant="outlined"
          margin="normal"
        />

        <TextField
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          fullWidth
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
        />

        <Button
          onClick={handleSignIn}
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: 20 }}
        >
          Sign In
        </Button>

        {error && (
          <Typography color="error" variant="body2" style={{ marginTop: 10, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 15 }}>
          <Typography variant="body2" style={{ paddingRight: 5 }}>
            Dont have an account?
          </Typography>
          <Typography
            onClick={() => {
              navigate("/user/signup");
            }}
            variant="body2"
            style={{
              color: "#2196f3",
              cursor: "pointer",
            }}
          >
            Signup
          </Typography>
        </div>
      </Card>
    </div>
  );
}

export default UserSignin;
