import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./signup"
import AppBar from "./appbar"
import Signin from './signin';
import Courses from "./Courses";
import Course from "./Course";
import AddCourse from './AddCourse';
import { Landing } from './Landing';
import { useState,useEffect } from 'react';


function App() {
  const [userEmail,setUserEmail] =useState(null);

  useEffect(() => {
    function callback2(data) {
      if (data.username) {
        setUserEmail(data.username);
      }
    }
    function callback1(res) {
      res.json().then(callback2);
    }
    console.log("token - " + localStorage.getItem("token"));
    
    fetch("http://localhost:3000/admin/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(callback1);
  }, []);

  return (
    <div style={{width: "100vw",
    height: "100vh",
    backgroundColor: "#eeeeee"}}>

<Router>
<AppBar userEmail={userEmail} setUserEmail={setUserEmail}></AppBar>
<Routes>

 <Route path={"/signup"} element={<Signup setUserEmail={setUserEmail} />} />
 <Route path='/signin' element={<Signin setUserEmail={setUserEmail}/>}/>
 <Route path={"/course/:courseId"} element={<Course />} />
 <Route path={"/courses"} element={<Courses />} />
 <Route path={"/addcourse"} element={<AddCourse />} />
 <Route path={"/"} element={<Landing userEmail={userEmail}/>}></Route>

</Routes>

</Router>
    </div>
  )
}

export default App
