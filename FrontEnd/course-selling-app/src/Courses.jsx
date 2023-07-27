import { Button, Card, Typography } from "@mui/material";
import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { coursesState } from "./store/atoms/courses";
import { coursesLoading, myCourses } from "./store/selectors/courses";


function Courses() {

  const setCourses = useSetRecoilState(coursesState);
  const courses = useRecoilValue(myCourses);
  const isLoading = useRecoilValue(coursesLoading);

  

  useEffect(() => {

    
 
  axios.get("http://localhost:3000/admin/courses/", {
    
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res)=>{
        setCourses({
          isLoading:false,
          courses:res.data.courses
        });
    }).catch(()=>{
      setCourses({
        isLoading:false,
        courses:null
      })
    })
   
   
    
  }, []);
  

  if (isLoading) {
    return <div style={{height: "100vh", justifyContent: "center", flexDirection: "column"}}>
        Loading....
    </div>
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

function Course({course}) {
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
      
      <div style={{
        display : 'flex',flexWrap: "wrap", justifyContent: "center"
      }}>
  <Button
            variant="contained"
            size="small"
            onClick={()=>{
              navigate("/course/"+course._id);
            }}
          >
            Update
          </Button>

      </div>
      
          
    </Card>
  );
}

export default Courses;
