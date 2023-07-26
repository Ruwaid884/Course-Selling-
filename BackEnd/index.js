const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const cors = require('cors')
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");



app.use(express.json());

app.use(cors());
app.use(bodyParser.json())

app.use("/admin", adminRouter)
app.use("/user", userRouter)



mongoose.connect('mongodb+srv://ruwaid:ruwaid@cluster0.mlnnycw.mongodb.net/Courses',{useNewUrlParser:true ,useUnifiedTopology: true});



app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
