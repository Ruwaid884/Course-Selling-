import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, Card, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userEmailState } from "./store/selectors/userEmailState";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [priceTag,setPrice] =useState("")
  const [isChecked, setIsChecked] = useState(false);
  const adminEmail = useRecoilState(userEmailState)[0];
  const navigate = useNavigate();

  if(!adminEmail){
    navigate("/");
  }
  return (
    <div style={{ display: "flex", justifyContent: "center",flexDirection:"column",alignItems:"center" }}>
      <Card varint={"outlined"} style={{ width: 400, padding: 20, marginTop:50 }}>

        <Grid item xs={12} md={6} lg={6}>

        <Typography variant="h5"> Add a course</Typography>

        </Grid>
        
        <div style={{
          marginTop:10
        }}>  <TextField
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          fullWidth={true}
          label="Title"
          variant="outlined"
        /></div>
         <div style={{
          marginTop:10
        }}>  <TextField
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          fullWidth={true}
          label="Description"
          variant="outlined"
        /></div>
         <div style={{
          marginTop:10
        }}>  <TextField
          onChange={(e) => {
            setImage(e.target.value);
          }}
          fullWidth={true}
          label="Image Link"
          variant="outlined"
        /></div>
       

       <div style={{
          marginTop:10
        }}>
        <TextField
          onChange={(e) => {
            if (isNaN(e.target.value)) {
              alert("Please enter the numeric value only");
              e.target.value = '';
            }
            else{
              setPrice(e.target.value)
            }
           
          }}
          fullWidth={true}
          label="Price"
          variant="outlined"
        />
        </div>

          <Typography display={"flex"}  marginTop={1} variant="h6">
            <Box>
              <FormControlLabel label ="Publish the Course for the User"  control = {
                 <Checkbox    
                  checked={isChecked}
                 onChange={(e)=>{
                 
                   setIsChecked(e.target.checked);
                   
                 }}/>
              }/>

            </Box>
          
            </Typography>
    


        <div style={{
          marginTop:10
        }}>

        <Button
          size={"large"}
          variant="contained"
          onClick={async() => {
            if (!title || !description || !priceTag || !image) {
              alert("Please fill in all the fields before adding the course.");
            }
            else {


              await axios.post("http://localhost:3000/admin/courses", {
              
            
                title: title,
                description: description,
                price:priceTag,
                imageLink:image,
                published:isChecked,
                postedBy:adminEmail,
                razorpay_order_id:"",
                razorpay_payment_id:"",
           } ,{
              headers: {
                
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
          });
          alert("Added Course!");
          navigate("/courses");
          

          }}

            }
            
        >
          {" "}
          Add course
        </Button>
        </div>
      </Card>
      <Footer/>
    </div>
  );
}

export default AddCourse;
