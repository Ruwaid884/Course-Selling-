import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { coursesState } from "./store/atoms/courses";
import { coursesLoading, myCourses } from "./store/selectors/courses";
import { courseState } from "./store/atoms/course";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";
import { useNavigate } from "react-router-dom";
import { purchase } from "./store/selectors/purchasedcourse";
import { purchaseState } from "./store/atoms/purchase";
import Footer from "./Footer";


function Courses() {
  const setCourses = useSetRecoilState(coursesState);
  const setCoursespurchase = useSetRecoilState(purchaseState);
  const courses = useRecoilValue(myCourses);
  const isLoading = useRecoilValue(coursesLoading);
  const userEmail = useRecoilValue(EmailState);
  const adminEmail = useRecoilValue(userEmailState);
  const navigate = useNavigate();

  if (!adminEmail && !userEmail) {
    navigate("/");
  }


  useEffect(()=>{

    axios
    .get("http://localhost:3000/user/purchasedCourses/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then((res) => {
      setCoursespurchase({
        isLoading: false,
        courses: res.data.purchasedCourses,
      });
    })
    .catch(() => {
      setCoursespurchase({
        isLoading: false,
        courses: [],
      });
    });

  },[])

  useEffect(() => {
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
    <div>
      <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {courses.map((course) => {
        return <Course course={course} key={course._id} />;
      })}
    </div>
    <Footer/>

    </div>
    
    
  );
}



function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const handleOpenRazorpay = (data, { course },setflag) => {

  
  const KEY_ID = "rzp_test_O6a77B92kQOpHr";
  displayRazorpay();

  async function displayRazorpay() {
    
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }
    console.log(data);
    const options = {
      key: KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: data.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: data.data.currency,
      name: "INFINIX",
      description: "COURSE PURCHASE",
      image:
        "https://static.vecteezy.com/system/resources/previews/014/441/310/non_2x/infinity-icon-3d-design-for-application-and-website-presentation-png.png",
      order_id: data._id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#000000",
      },
      handler: async function (response) {

       await axios.post("http://localhost:3000/user/verify",{response:response}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then(async ()=>{
          await axios
            .post(
              "http://localhost:3000/user/courses/" + course._id,
              {},
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              }
            )
            .then(() => {
              alert("course purchased successfully");
              setflag(true);
            })
            .catch(() => {
              alert("Course already purchased");
            });
        
      }).catch((err) => {
        console.log(err);
      });
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
};

const handlePayment = ({ course },setflag) => {
  const _data = { amount: course.price };
  axios
    .post("http://localhost:3000/user/order", _data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then((res) => {
      handleOpenRazorpay(res.data, { course },setflag);
    })
    .catch((err) => {
      console.log(err);
    });
};

function Course({ course }) {
  const purchasedCourses = useRecoilValue(purchase);
  const setCourse = useSetRecoilState(courseState);
  const userEmail = useRecoilValue(EmailState);
  const adminEmail = useRecoilValue(userEmailState);
  const [flag,setflag] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{

    if (purchasedCourses.some(purchasedCourse => purchasedCourse._id === course._id)) {
      setflag(true);
  }

  },[])
  

  return (
    <Card
      style={{
        margin: 10,
        width: 300,
        minHeight: 250,
        padding: 16,
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
        style={{ width: 200, marginBottom: 16 }}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {adminEmail && (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setCourse({ isLoading: false, course: course });
                navigate("/course/" + course._id);
              }}
              style={{ margin: 2 }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                navigate("/chat/" + adminEmail);
              }}
              style={{ margin: 2 }}
            >
              Join
            </Button>
          </>
        )}

        {userEmail && (
          <Button
            variant="contained"
            size="small"
            onClick={
              async()=>{
                 await axios
                .post(
                  "http://localhost:3000/user/lookpurchase/" + course._id,
                  {},
                  {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }
                )
                .then(() => {
                  handlePayment({ course },setflag);
                  
                })
                .catch(() => {
                  console.log(purchasedCourses)
                  console.log(flag)
                  if(flag) navigate("/videos/content/" + course._id);
                 
                });
              }
            }
            style={{ margin: 2 }}
          >
            {
              !flag?"purchase":"open"
            }
          </Button>
        )}
      </div>
    </Card>
  );
}

export default Courses;
