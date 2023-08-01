import { Button, Card, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { coursesState } from "./store/atoms/courses";
import { coursesLoading, myCourses } from "./store/selectors/courses";
import { courseState } from "./store/atoms/course";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";

function Courses() {
  const setCourses = useSetRecoilState(coursesState);
  const courses = useRecoilValue(myCourses);
  const isLoading = useRecoilValue(coursesLoading);
  const userEmail = useRecoilValue(EmailState);
  const adminEmail = useRecoilValue(userEmailState);

  useEffect(() => {
    console.log(adminEmail);
    console.log(userEmail);
    if (adminEmail) {
      axios
        .get("http://localhost:3000/admin/courses/", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setCourses({
            isLoading: false,
            courses: res.data.courses,
          });
        })
        .catch(() => {
          setCourses({
            isLoading: false,
            courses: [],
          });
        });
    } else if (userEmail) {
      axios
        .get("http://localhost:3000/user/courses/", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setCourses({
            isLoading: false,
            courses: res.data.courses,
          });
        })
        .catch(() => {
          setCourses({
            isLoading: false,
            courses: null,
          });
        });
    }
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
    {adminEmail &&  <Typography
        textAlign={"center"}
        variant="h5"
        style={{ marginTop: 10 }}
      >
        COURSES UPLOADED BY YOU
      </Typography>
      }

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
  const setCourse = useSetRecoilState(courseState);
  const navigate = useNavigate();
  const adminEmail = useRecoilValue(userEmailState);
  const userEmail = useRecoilValue(EmailState);
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
        {adminEmail && (
          <div>
            <Button
              variant="contained"
              size="small" 
              style={{marginRight:10}}
              onClick={async () => {
                setCourse({ isLoading: false, course: course });
                navigate("/course/" + course._id);
              }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                navigate("/chat/" + adminEmail);
              }}
            >
              Chat Room
            </Button>
          </div>
        )}

        {userEmail && (
          <Button
            variant="contained"
            size="small"
            onClick={async () => {
              const token = localStorage.getItem("token");
              if (!token) {
                console.log("No token found in localStorage.");
                return;
              }

              axios
                .post(
                  "http://localhost:3000/user/courses/" + course._id,
                  {},
                  {
                    headers: {
                      Authorization: "Bearer " + token,
                    },
                  }
                )
                .then(() => {
                  alert("course purchased successfully");
                })
                .catch(() => {
                  alert("Course already purchased");
                });
            }}
          >
            Purchase
          </Button>
        )}
      </div>
    </Card>
  );
}

export default Courses;
