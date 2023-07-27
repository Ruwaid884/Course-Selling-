import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useRecoilValue, useSetRecoilState,useRecoilState } from "recoil";
import {courseDescription, courseImage, coursePrice, courseTitle, isCourseLoading} from "./store/selectors/course";
import { courseState } from "./store/atoms/course";

function Course() {
    let { courseId } = useParams();
    const setCourse = useSetRecoilState(courseState);
    const CourseLoading = useRecoilValue(isCourseLoading)

    
    useEffect(() => {
        axios.get("http://localhost:3000/admin/course/" + courseId, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setCourse({isLoading: false, course: res.data.course});
        })
        .catch(()=> {
            setCourse({isLoading: false, course: null});
        });
    }, []);

    if (CourseLoading) {
        return <div style={{height: "100vh", justifyContent: "center", flexDirection: "column"}}>
            Loading....
        </div>
    }

    return <div>
        <GrayTopper />
        <Grid container>
            <Grid item lg={8} md={12} sm={12}>
                <UpdateCard  />
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                <CourseCard  />
            </Grid>
        </Grid>
    </div>
}

function GrayTopper() {
    const title = useRecoilValue(courseTitle)
    return <div style={{height: 250, background: "#212121", top: 0, width: "100vw", zIndex: 0, marginBottom: -250}}>
        <div style={{ height: 250, display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <div>
                <Typography style={{color: "white", fontWeight: 600}} variant="h3" textAlign={"center"}>
                    {title}
                </Typography>
            </div>
        </div>
    </div>
}

function UpdateCard() {
    
    const [courseDetails,setCourse]=useRecoilState(courseState)
    
    const [title, setTitle] = useState(courseDetails.course.title);
    const [description, setDescription] = useState(courseDetails.course.description);
    const [image, setImage] = useState(courseDetails.course.imageLink);
    const [price, setPrice] = useState(courseDetails.course.price || '');

    useEffect(() => {
    setTitle(courseDetails.course.title);
    setDescription(courseDetails.course.description);
    setImage(courseDetails.course.imageLink);
    if(courseDetails.course.price)
    setPrice(courseDetails.course.price);
  }, [courseDetails]);

    return <div style={{display: "flex", justifyContent: "center"}}>
    <Card varint={"outlined"} style={{maxWidth: 600, marginTop: 200}}>
        <div style={{padding: 20}}>
            <Typography style={{marginBottom: 10}}>Update course details</Typography>
            <TextField
                value={title}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
                fullWidth={true}
                label="Title"
                variant="outlined"
            />

            <TextField
                value={description}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setDescription(e.target.value)
                }}
                fullWidth={true}
                label="Description"
                variant="outlined"
            />

            <TextField
                value={image}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setImage(e.target.value)
                }}
                fullWidth={true}
                label="Image link"
                variant="outlined"
            />
            <TextField
                value={price}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    if (isNaN(e.target.value)) {
                        alert("Please enter the numeric value only")
                      }
                      else{
                        setPrice(e.target.value)
                      }
                   
                }}
                fullWidth={true}
                label="Price"
                variant="outlined"
            />

            <Button
                variant="contained"
                onClick={async () => {
                    axios.put("http://localhost:3000/admin/courses/" + courseDetails.course._id, {
                        title: title,
                        description: description,
                        imageLink: image,
                        published: true,
                        price: price
                    }, {
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    });
                    let updatedCourse = {
                        _id: courseDetails.course._id,
                        title: title,
                        description: description,
                        imageLink: image,
                        price:price
                    };
                    setCourse({isLoading:false,course:updatedCourse});
                }}
            > Update course</Button>
        </div>
    </Card>
</div>
}

function CourseCard() {

    return <div style={{display: "flex",  marginTop: 50, justifyContent: "center", width: "100%"}}>
     <Card style={{
        margin: 10,
        width: 350,
        minHeight: 200,
        borderRadius: 20,
        marginRight: 50,
        paddingBottom: 15,
        zIndex: 2
    }}>
        <Image></Image>
        <div style={{marginLeft: 10}}>
        
        <Description></Description>
           <Price></Price>
        </div>
    </Card>
    </div>
}


function Image(){
    const imageLink = useRecoilValue(courseImage);
    return <div>
        <img src={imageLink} style={{width: 350}} ></img>
    </div>
    
}

function Description(){

    const description = useRecoilValue(courseDescription);
    return <Typography variant="h5">{description}</Typography>
}

function Price(){

    const price = useRecoilValue(coursePrice);

    return <>
    <Typography variant="subtitle2" style={{color: "gray"}}>
        Price
    </Typography>
    <Typography variant="subtitle1">
        <b>Rs {price} </b>
    </Typography>
</>
}

export default Course;