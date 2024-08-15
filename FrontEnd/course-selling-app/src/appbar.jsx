import  {  useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";
import { userLoadingState } from "./store/selectors/userLoadingState";
import { UserState, adminState } from "./store/atoms/user";
import { LoadingState } from "./store/selectors/userLoadingState";
import { coursesState } from "./store/atoms/courses";
import axios from "axios";

import "./AppBar.css";
import Loader from "./circle";

function AppBar() {
  const navigate = useNavigate();
  const adminLoading = useRecoilValue(userLoadingState);
  const adminEmail = useRecoilValue(userEmailState);
  const setAdmin = useSetRecoilState(adminState);
  const setUser = useSetRecoilState(UserState);
  const userEmail = useRecoilValue(EmailState);
  const userLoading = useRecoilValue(LoadingState);
  const setCourses = useSetRecoilState(coursesState);
  const [showMobileMenu, setShowMobileMenu] = useState(false);


  const handleLogout = () => {
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
  };

  // Function to toggle the mobile menu visibility
  const toggleMenu = () => {
    setShowMobileMenu((prevShowMobileMenu) => !prevShowMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

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
    return(
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"column", width:"100%"}}>
      <Loader flag={true} />
       </div>
    )
  } else if (userLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"column", width:"100%"}}>
      <Loader flag={true} />
       </div>
    )
  }

  return (
    <div className="app-bar-container">
      <div className="logo-container" onClick={() => navigate("/")}>
        <Typography color="#FFFFFF" marginTop={0.5} variant="h5">
          INFINIX
        </Typography>
      </div>
      <div className="menu-container">
        <div className="menu-items">
          {adminEmail ? (
            <>
              <Button
                className="menu-item"
                style={{ color: "#FFFFFF" }}
                onClick={() => navigate("/addcourse")}
              >
                Add Course
              </Button>
              <Button
                className="menu-item"
                style={{ color: "#FFFFFF" }}
                onClick={() => navigate("/courses")}
              >
                Courses
              </Button>
              <Button
                variant="contained"
                className="menu-item"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : userEmail ? (
            <>
              <Button
                className="menu-item"
                style={{ color: "#FFFFFF" }}
                onClick={() => navigate("/purchasedCourses")}
              >
                Purchased Courses
              </Button>
              <Button
                className="menu-item"
                style={{ color: "#FFFFFF" }}
                onClick={() => navigate("/courses")}
              >
                Courses
              </Button>
              <Button
                variant="contained"
                className="menu-item"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="mobile-menu">
        <button onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        {showMobileMenu && (
          <div className="mobile-menu-items">
            {adminEmail ? (
              <>
                <Button
                  className="menu-item"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => {
                    navigate("/addcourse");
                    closeMobileMenu(); // Close the mobile menu when menu item is clicked
                  }}
                >
                  Add Course
                </Button>
                <Button
                  className="menu-item"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => {
                    navigate("/courses");
                    closeMobileMenu(); // Close the mobile menu when menu item is clicked
                  }}
                >
                  Courses
                </Button>
                <Button
                  variant="contained"
                  className="menu-item"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu(); // Close the mobile menu when menu item is clicked
                  }}
                >
                  Logout
                </Button>
              </>
            ) : userEmail ? (
              <>
                <Button
                  className="menu-item"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => {
                    navigate("/purchasedCourses");
                    closeMobileMenu(); // Close the mobile menu when menu item is clicked
                  }}
                >
                  Purchased Courses
                </Button>
                <Button
                  className="menu-item"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => {
                    navigate("/courses");
                    closeMobileMenu(); // Close the mobile menu when menu item is clicked
                  }}
                >
                  Courses
                </Button>
                <Button
                  variant="contained"
                  className="menu-item"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu(); // Close the mobile menu when menu item is clicked
                  }}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppBar;
