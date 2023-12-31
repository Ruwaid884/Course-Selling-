
import { useEffect } from "react";
import axios from "axios";
import { Button, Card, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { purchaseState } from "./store/atoms/purchase";
import { PurchasecoursesLoading, purchase } from "./store/selectors/purchasedcourse";
import {  useNavigate } from "react-router-dom";
import { socketState } from "./store/atoms/socket";



function PurchasedCourses() {
  const setCourses = useSetRecoilState(purchaseState);
  const courses = useRecoilValue(purchase);
  const isLoading = useRecoilValue(PurchasecoursesLoading);


  useEffect(() => {
    axios
      .get("http://localhost:3000/user/purchasedCourses/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
      setCourses({
        isLoading:false,
        courses:res.data.purchasedCourses
      });
      })
      .catch(() => {
        setCourses({
          isLoading:false,
          courses:[]
        })
      });
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Loading....
      </div>
    );
  }

  return (
    <div>
      <Typography
        textAlign={"center"}
        variant="h5"
        style={{ marginTop: 10 }}
      >
      PURCHASED COURSES
      </Typography>
      

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {courses.map((course) => {
          return <Course course={course} />;
        })}
      </div>
    </div>
  );
}

function Course({ course }) {
  const setSocket = useSetRecoilState(socketState);
  const navigate = useNavigate();
  return (
   <Card
      style={{
        margin: 10,
        width: 300,
        minHeight: 200,
      }}
    >
      <Typography textAlign={"center"} variant="h5">
        {course.title}
      </Typography>
      <Typography textAlign={"center"} variant="subtitle1">
        {course.description}
      </Typography>
      <img src={course.imageLink} style={{ width: 300 }}></img>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
          <div>
            <Button
              variant="contained"
              size="small" 
              style={{marginRight:10}}
            >
             VIEW
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={()=>{
                navigate("/chat/"+course.postedBy);
              }}
        
            >
              CLASSROOM
            </Button>
            </div>
      </div>
    </Card>
  );
}

export default PurchasedCourses;
