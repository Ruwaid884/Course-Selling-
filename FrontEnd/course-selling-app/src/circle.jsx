import { motion, useTime, useTransform } from 'framer-motion';
import "./circle.css"

const Loader = ({ flag = true }) => {
    const time = useTime();
  const rotate = useTransform(time, [0, 175], [0, 360], { clamp: false });


    return (
        <div style={{width:"100vw", height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>

      <div className="example-container">
            <motion.div
              className="circular-text"
              style={{
                rotate
              }}
            >
            </motion.div>
      </div>
      <div>{flag ? "Appreciating your patience! Hold on a sec":""}</div>
      </div>
    );
  };

  export default Loader;
