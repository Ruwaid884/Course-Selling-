import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";
import { userLoadingState } from "./store/selectors/userLoadingState";
import { UserState, adminState } from "./store/atoms/user";
import { LoadingState } from "./store/selectors/userLoadingState";
import { coursesState } from "./store/atoms/courses";
import axios from "axios";

function AppBar() {
  const navigate = useNavigate();
  const adminLoading = useRecoilValue(userLoadingState);
  const adminEmail = useRecoilValue(userEmailState);
  const setAdmin = useSetRecoilState(adminState);
  const setUser = useSetRecoilState(UserState);
  const userEmail = useRecoilValue(EmailState);
  const userLoading = useRecoilValue(LoadingState);
  const setCourses = useSetRecoilState(coursesState);

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
          courses: null,
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

  if (adminLoading) {
    return <div></div>;
  } else if (userLoading) {
    return <div></div>;
  }

  if (adminEmail) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#050505",
        }}
      >
        <div>
          <Typography
            color={"#FFFFFF"}
            marginTop={0.5}
            onClick={() => {
              navigate("/");
            }}
            variant="h5"
          >
            {" "}
            INFINIX
          </Typography>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 10, display: "flex" }}>
            <div style={{ marginRight: 10 }}>
              <Button
                style={{
                  color: "#FFFFFF",
                }}
                onClick={() => {
                  navigate("/addcourse");
                }}
              >
                Add course
              </Button>
            </div>

            <div style={{ marginRight: 10 }}>
              <Button
                style={{
                  color: "#FFFFFF",
                }}
                onClick={() => {
                  navigate("/courses");
                }}
              >
                Courses
              </Button>
            </div>

            <Button
              variant={"contained"}
              onClick={() => {
                localStorage.setItem("token", null);
                if (adminEmail) {
                  setAdmin({
                    isLoading: false,
                    userEmail: null,
                  });
                } else {
                  setUser({
                    isLoading: false,
                    userEmail: null,
                  });
                }

                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (userEmail) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#050505",
        }}
      >
        <div>
          <Typography
            color={"#FFFFFF"}
            marginTop={0.5}
            onClick={() => {
              navigate("/");
            }}
            variant="h5"
          >
            {" "}
            INFINIX
          </Typography>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 10, display: "flex" }}>
            <div style={{ marginRight: 10 }}>
              <Button
                style={{
                  color: "#FFFFFF",
                }}
                onClick={() => {
                  navigate("/purchasedCourses");
                }}
              >
                Purchased Course
              </Button>
            </div>

            <div style={{ marginRight: 10 }}>
              <Button
                style={{
                  color: "#FFFFFF",
                }}
                onClick={() => {
                  navigate("/courses");
                }}
              >
                Courses
              </Button>
            </div>

            <Button
              variant={"contained"}
              onClick={() => {
                localStorage.setItem("token", null);
                setUser({
                  isLoading: false,
                  userEmail: null,
                });
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}
export default AppBar;
