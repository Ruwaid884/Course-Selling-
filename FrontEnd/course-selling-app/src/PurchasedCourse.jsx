
import { useEffect } from "react";
import axios from "axios";
import { Button, Card, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { purchaseState } from "./store/atoms/purchase";
import { PurchasecoursesLoading, purchase } from "./store/selectors/purchasedcourse";

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
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {courses.map((course) => {
        return <Course course={course} />;
      })}
    </div>
  );
}

function Course({ course }) {
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
        <Button variant="contained" size="small">
          View
        </Button>
      </div>
    </Card>
  );
}

export default PurchasedCourses;
