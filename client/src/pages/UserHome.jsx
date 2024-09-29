import React from "react";
import { motion } from "framer-motion";
import EarthCanvas from "../canvas/EarthCanvas";
import SectionWrapper from "../hoc";
import { slideIn } from "../utils/motion";
import { Stars } from "@react-three/drei";
import StarsCanvas from "../canvas/Stars";
import './UserHome.css'
import Card from "./Card";

function UserHome() {
  return (
    <>
      <div className="relative z-0 bg-black">
        <div
          className={` flex xl:flex-row flex-col-reverse overflow-hidden `}
          >
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="flex-[0.75] bg-black-100 p-11 rounded-2xl text-left "
            >
            <div className="mt-10">

            <span className="text-4xl m-3  font-serif text-white">Welcome to </span>
            <span className="text-9xl m-3 font-bold font-serif bg-gradient-to-r from-blue-300 to-yellow-300 text-transparent bg-clip-text moving-gradient">
              PIIShield
            </span>
            <h3 className="text-2xl font-serif m-3 italic text-white mb-10">Your PII, Our Concern</h3>
            </div>
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px] mt-10"
            >
            <EarthCanvas />
          </motion.div>
        </div >
        <div className="text-left ml-12 text-gray-200 font-serif text-2xl mt-10 ">Our Services</div>
        <hr className="border-t-2 border-gray-500 my-4 ml-10 mr-10" />

        <StarsCanvas></StarsCanvas>
        <div className="flex justify-between">
  <Card  name='Aadhar Card' image='https://www.goodreturns.in/img/2024/05/aadhaar-card-1714630652.jpg' />
  <Card name='Pan Card' image='https://im.rediff.com/news/2023/mar/03pan.jpg' />

  <Card name='Driving License' image='https://www.superprof.co.in/blog/wp-content/uploads/2021/10/driver-licence.jpg' />
</div>

      </div>
    </>
  );
}

export default UserHome;
