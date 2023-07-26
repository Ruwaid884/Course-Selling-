import { Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";


function Courses() {


  const [courses, setCourses] = useState([]);

  useEffect(() => {

    
 
  axios.get("http://localhost:3000/admin/courses/", {
    
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res)=>{
        setCourses(res.data.courses);
    })
   
   
    
  }, []);

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
