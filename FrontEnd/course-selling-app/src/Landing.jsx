import { Grid, Typography} from "@mui/material";

import Button from "@mui/material/Button";
import { useNavigate} from "react-router-dom";
import { useRecoilValue } from "recoil";
import {EmailState, userEmailState} from "./store/selectors/userEmailState";
import Footer from "./Footer";
import { useRef } from "react";
import "./Framer.css"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";









function ParallaxText({ children, baseVelocity = 100}) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
      clamp: false
    });
  
    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  
    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
  
      /**
       * This is what changes the direction of the scroll once we
       * switch scrolling directions.
       */
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
  
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
  
      baseX.set(baseX.get() + moveBy);
    });
  
    /**
     * The number of times to repeat the child text should be dynamically calculated
     * based on the size of the text and viewport. Likewise, the x motion value is
     * currently wrapped between -20 and -45% - this 25% is derived from the fact
     * we have four children (100% / 4). This would also want deriving from the
     * dynamically generated number of children.
     */
    return (
      <div className="parallax">
        <motion.div className="scroller" style={{ x }}>
          <span>{children} </span>
          <span>{children} </span>
          <span>{children} </span>
          <span>{children} </span>
        </motion.div>
      </div>
    );
  }




export const Landing = () => {
    const userEmail = useRecoilValue(userEmailState);
    const Email = useRecoilValue(EmailState);
    const navigate = useNavigate()
    return <div>
        <Grid container style={{padding: "5vw",background:"#FFFFFF"}}>
            <Grid item xs={12} md={6} lg={6}>
                <div style={{marginTop: 100}}>
                 <Grid item xs={12} md={6} lg={6}>
                   <img style={{
                    width:150,
                    height:80
                   }} src={"https://bl-i.thgim.com/public/news/7gk5z8/article65615786.ece/alternates/FREE_1200/infinix.jpg"}  />
                  </Grid> 
                  <Typography variant={"h5"}>
                        A place to learn, earn and grow
                    </Typography>
                   { !(userEmail || Email) && <div style={{display: "flex", marginTop: 20}}>
                    <div style={{ display:"flex",flexWrap:"wrap"}}>
                    <Button style={{marginRight: 10,
                    marginBottom:5,
                     display:"flex",
                     flexWrap:"wrap",
                     background:"#050505",
                     height:40,width:40,
                     justifyContent:"center"}}
                                size={"large"}
                                variant={"contained"}
                                onClick={() => {
                                    navigate("/user/signin")
                                }}
                            >USER</Button>
                        
                        <Button style={{background:"#050505",marginRight: 10,marginBottom:5, display:"flex",flexWrap:"wrap",height:40,width:40,justifyContent:"center"}}
                      
                                size={"large"}
                                variant={"contained"}
                                onClick={() => {
                                    navigate("/admin/signin")
                                }}
                            >ADMIN</Button>


                    </div>
                           
                        </div>
                    }
                </div>
                <div>
                </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}  style={{marginTop: 10}}>
                <img src={"https://cdn-gkoob.nitrocdn.com/TmnXXZHhdsQBcdKrWSrrxYcYJKLiuUED/assets/images/optimized/rev-d932da8/wp-content/uploads/2022/07/deneme2.png"} width={"100%"} />
            </Grid>
            <section>
        <ParallaxText baseVelocity={2}>A Place to Learn and Provide some quality Content</ParallaxText>
        </section>

            
        </Grid>
         <Grid container spacing={5}>
                <Grid item xs={12} md={4} lg={4} style={{ marginTop: 10 }}>
                    <img
                        src="https://img.freepik.com/free-vector/hand-drawn-flat-design-api-illustration_23-2149365021.jpg?w=740&t=st=1716358969~exp=1716359569~hmac=c382c0ca27c29a78415f3f52ac7bcbce025d7bbc50756d0e848ce3d9122c7ddf"
                        width="100%"
                        alt="Image 1"
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4} style={{ marginTop: 10 }}>
                    <img
                        src="https://img.freepik.com/premium-vector/vector-hand-coding-website-concept-illustration_987561-8.jpg?w=740"
                        width="100%"
                        alt="Image 2"
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4} style={{ marginTop: 10 }}>
                    <img
                        src="https://img.freepik.com/free-vector/code-typing-concept-illustration_114360-3581.jpg?w=740&t=st=1716359024~exp=1716359624~hmac=f0d2a373ebcc1f89c19b5ba0d1cfd7bc12a461a769e0ae70572a52c4a676c571"
                        width="100%"
                        alt="Image 3"
                    />
                </Grid>
            </Grid>

            <Footer/>


            
    
    </div>
}
