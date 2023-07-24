import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./signup"
import AppBar from "./appbar"
import Signin from './signin';


function App() {

  return (
    <div style={{width: "100vw",
    height: "100vh",
    backgroundColor: "#eeeeee"}}>

<Router>
<AppBar></AppBar>
<Routes>

 <Route path={"/signup"} element={<Signup />} />
 <Route path='/signin' element={<Signin/>}/>

</Routes>

</Router>
    </div>
  )
}

export default App
