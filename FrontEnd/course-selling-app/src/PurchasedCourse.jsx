import { useEffect } from "react";
import axios from "axios";
import { Button, Card, Grid, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { purchaseState } from "./store/atoms/purchase";
import { PurchasecoursesLoading, purchase } from "./store/selectors/purchasedcourse";
import { useNavigate } from "react-router-dom";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";

function PurchasedCourses() {
  
  const setCourses = useSetRecoilState(purchaseState);
  const courses = useRecoilValue(purchase);
  const isLoading = useRecoilValue(PurchasecoursesLoading);
  const adminemail = useRecoilValue(EmailState);
  const userEmail = useRecoilValue(userEmailState);
  const navigate = useNavigate();

  if(!adminemail && !userEmail){
    navigate("/");
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/purchasedCourses/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCourses({
          isLoading: false,
          courses: res.data.purchasedCourses,
        });
      })
      .catch(() => {
        setCourses({
          isLoading: false,
          courses: [],
        });
      });
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5">Loading...</Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      {courses.map((course) => (
        <Grid item xs={12} md={6} lg={4} key={course.id}>
          <Card
            sx={{
              justifyContent: "center",
              margin: 2,
              width: 300,
              minHeight: 250,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.3s",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography variant="h5" textAlign="center">
              {course.title}
            </Typography>
            <Typography variant="subtitle1" textAlign="center">
              {course.description}
            </Typography>
            <img
              src={course.imageLink}
              alt={course.title}
              style={{ width: 200, marginBottom: 2 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ margin: 2 }}
               onClick={()=>{
                navigate("/videos/content/"+course._id);
               }}
              >
                View Course
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{ margin: 2 }}
                onClick={() => {
                  navigate("/chat/" + course.postedBy);
                }}
              >
                Classroom Chat
              </Button>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PurchasedCourses;

