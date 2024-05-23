import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminSignup from './AdminSignup';
import AppBar from "./appbar"
import AdminSignin from './Adminsignin';
import UserSignin from './UserSignin';
import Courses from "./Courses";
import Course from "./Course";
import AddCourse from './AddCourse';
import UserSignup from './UserSignup';
import { Landing } from './Landing';
import { useEffect } from 'react';
import axios from 'axios';
import { UserState, adminState } from "./store/atoms/user.js";
import {
    RecoilRoot,
    useSetRecoilState
} from 'recoil';
import PurchasedCourses from './PurchasedCourse';
import Chat from './chat ';
import CourseContent from './CourseContent';
import VideoPlayer from './VideoPlayer';
import Player from './play';

function App() {
    return (
        <RecoilRoot>
            <div style={{width: "100vw",
                height: "100vh",
                backgroundColor: "#FFFFFF"}}
            >
                    <Router>
                        <AppBar></AppBar>
                        <InitAdmin />
                        <InitUser/>
                        <Routes>
                            <Route path={"/addcourse"} element={<AddCourse />} />
                            <Route path={"/course/:courseId"} element={<Course />} />
                            <Route path={"/courses"} element={<Courses />} />
                            <Route path={"/admin/signin"} element={<AdminSignin />} />
                            <Route path={"/user/signin"} element={<UserSignin />} />
                            <Route path={"/user/signup"} element={<UserSignup />} />
                            <Route path={"/admin/signup"} element={<AdminSignup />} />
                            <Route path={"/purchasedCourses"} element = {<PurchasedCourses/>}/>
                            <Route path={"/chat/:admin"} element = {<Chat/>}/>
                            <Route path={"/"} element={<Landing />} />
                            <Route path={"/purchase/:courseId"} element={<CourseContent />} />
                            <Route path={"/videos/content/:courseId"} element ={<VideoPlayer/>}/>
                            <Route path={"/player/:videoId"} element ={<Player/>}/>

                        </Routes>
                    </Router>
            </div>
        </RecoilRoot>
    );
}


function InitAdmin() {
    const setAdmin = useSetRecoilState(adminState);
    const init = async() => {
        try {
            const response = await axios.get(`http://localhost:3000/admin/me`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })

            if (response.data.username) {
                setAdmin({
                    isLoading: false,
                    userEmail: response.data.username
                })
            } else {
                setAdmin({
                    isLoading: false,
                    userEmail: null
                })
            }
        } catch (e) {

            setAdmin({
                isLoading: false,
                userEmail: null
            })
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>
}



function InitUser() {
    const setUser = useSetRecoilState(UserState);
    const init = async() => {
        try {
            const response = await axios.get(`http://localhost:3000/user/me`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })

            if (response.data.username) {
                setUser({
                    isLoading: false,
                    userEmail: response.data.username
                })
            } else {
                setUser({
                    isLoading: false,
                    userEmail: null
                })
            }
        } catch (e) {

            setUser({
                isLoading: false,
                userEmail: null
            })
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>
}

export default App;
