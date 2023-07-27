import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [priceTag,setPrice] =useState("")

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card varint={"outlined"} style={{ width: 400, padding: 20 }}>
        <TextField
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          fullWidth={true}
          label="Title"
          variant="outlined"
        />

        <TextField
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          fullWidth={true}
          label="Description"
          variant="outlined"
        />

        <TextField
          onChange={(e) => {
            setImage(e.target.value);
          }}
          fullWidth={true}
          label="Image link"
          variant="outlined"
        />
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
                imageLink: image,
                published: true,
           } ,{
              headers: {
                
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
          });
          alert("Added Course!");
          }}

            }
            
        >
          {" "}
          Add course
        </Button>
      </Card>
    </div>
  );
}

export default AddCourse;
