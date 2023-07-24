import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import {Card,Typography} from "@mui/material"


function Signin(){
return <div>
    <div style={{
        paddingTop:15,
        marginBottom:10,
        display:"flex",
        justifyContent:"center"
    }}>
        <div>  <Typography variant={"h6"}>
  Welcome to the Infinix... signIn below
  </Typography>
  </div>
  

  </div> 
  <div style={{
      display:'flex',
      justifyContent:'center'
  }}>
        <Card style ={{
      width : 300,
      padding:20
  }}
  variant="outlined">
      {
      <div>
      <TextField fullWidth={true} id="outlined-basic" label="Username" variant="outlined" />
      <br></br>
      <div style={{marginTop:10}}>
      <TextField
      fullWidth = {true}
      id="outlined-basic" label="Password" variant="outlined" type="password" />  
      </div> 
      <br></br>
      <Button variant="contained">SignIn</Button>
        
        </div>
    }</Card>

    </div>
    
  




</div>
}

export default Signin