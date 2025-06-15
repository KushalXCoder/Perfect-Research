import {React, useState, useEffect } from 'react';
import LinkedIn from '/linkedin.png';
import GitHub from '/github.png';
import axios from 'axios';
import Heart from "/heart.gif";
import { AnimatePresence, motion } from "motion/react";

const Popup = () => {

  const [name, setName] = useState('');
  const [hIndex, setHIndex] = useState('**');
  const [isFound, setIsFound] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    if (showBox) {
      const timer = setTimeout(() => {
        setShowBox(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showBox]);

  const handleChange = (e) => {
    setName(e.target.value);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (name.trim() === "") {
      setIsLoading(false);
      setShowBox(true);
      setHIndex("NULL");
      setIsFound(false);
      return;
    }

    setIsLoading(true);
    localStorage.setItem("publisher", name);

    try {
        const response = await axios.post('https://perfect-research-1.onrender.com/search', {publisher: name});

        if(response.data.response.length === 0) {
            setHIndex("0");
            setIsFound(false);
        }

        else {
            let matched = false;
            for(const item of response.data.response) {
                if(item.name.toLowerCase() === name.toLowerCase()) {
                    setHIndex(item.hIndex);
                    setIsFound(true);
                    matched = true;
                    break;
                }
            }

            if(!matched) {
                setHIndex("??");
                setIsFound(false);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        setIsFound(false);
    }
    finally {
        setIsLoading(false);
    }
  }

  return (
    <>
        <div className="parent-container h-screen w-screen bg-blue-800 flex flex-col justify-between relative overflow-x-hidden">
            <div className="container-1">
              <h1 className='text-3xl font-bold w-full text-yellow-500 font-text border-4 border-orange-400 text-center py-2'>Perfect Research</h1>
              <p className='text-white text-center mt-8 px-3 font-text text-xl sm:text-lg'>Perfect Reserach is a tool to help you find the <br/> <span className='underline text-yellow-500 font-bold cursor-pointer'><a href="https://en.wikipedia.org/wiki/H-index" target='_blank'>H-Index</a></span> of a research paper, to ensure you get knowledge from a good one and not just consume garbage 😄.</p>
              <form action="" className='w-full mt-5' onSubmit={handleSubmit}>
                  <div className="input w-full flex flex-col justify-center items-center">
                      <input value={name} name='publisher' type="text" placeholder='Enter publishing name' className='lg:w-2/4 bg-white rounded-md px-3 py-2 font-text mt-5 sm:w-3/4' onChange={(e) => handleChange(e)}/>
                      <motion.button type='submit' className={`button lg:w-1/5 bg-yellow-400 mt-3 rounded-md py-1 cursor-pointer relative z-10 font-text hover:text-white text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isLoading ? `opacity-50 cursor-not-allowed` : ``} sm:w-2/4`} whileHover={{scale: 0.9}} whileTap={{scale: 1.01}} disabled={isLoading}>Submit</motion.button>
                  </div>
              </form>
              <div className="result-section lg:w-3/5 h-20 bg-amber-100 mt-5 ms-auto me-auto rounded-md flex justify-center sm:w-4/5">
                  <div className="display-result flex flex-col justify-start">
                      <h1 className='lg:text-4xl font-bold lg:mt-1.5 text-center sm:text-3xl sm:mt-0.5'>{hIndex}</h1>
                      {isFound ? (
                        <p className='result-meaning font-text text-sm sm:text-center'>
                            The minimum H-Index for a good research paper is 50.
                        </p>
                        )
                        :
                        <p className='result-meaning font-text text-sm sm:text-center'>
                            {hIndex === "??"
                                ? "Too many results. Please enter a more specific name."
                                : hIndex === "NULL" ? "Please enter input"
                                : "Publisher not found, look for some good research paper."}
                        </p>
                      }
                  </div>
              </div>
              <div className="connect w-full mt-5">
                  <ul className='w-full flex gap-5 justify-center mt-3'>
                      <li><a href="https://www.linkedin.com/in/kushal-rathod-90b800297/" target='_blank'><img src={LinkedIn} alt="LinkedIn Logo" className='h-14 hover:shadow-2xl hover:shadow-yellow-300'/></a></li>
                      <li><a href="https://github.com/KushalXCoder" target='_blank'><img src={GitHub} alt="LinkedIn Logo" className='h-14 hover:shadow-2xl hover:shadow-yellow-300'/></a></li>
                  </ul>
              </div>
              {isLoading && (
                <div className="loader-container w-full flex justify-center mt-10 absolute bottom-2/6">
                    <span className="loader"></span>
                </div>
              )}
              <div className="working lg:mt-10 lg:mb-0 flex flex-col justify-center items-center sm:mt-5 sm:mb-5">
                <h1 className="font-text text-2xl text-yellow-400 font-bold border-2 border-orange-400 p-3 inline rounded mb-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Working</h1>
                <p className="lg:w-4/5 text-white text-center mt-2 font-text text-lg px-4 sm:w-full">Perfect Research fetches data directly from <span className="text-yellow-400 font-bold underline"><a href="https://scholar.google.co.in/citations?view_op=top_venues">Google Scholar Metrics</a></span>, ensuring accuracy and credibility. By verifying the <span className="text-yellow-400 font-bold underline"><a href="https://en.wikipedia.org/wiki/H-index">H-Index</a></span> of research papers, it helps you make informed decisions and avoid misleading information. Our goal is to make academic research more reliable and accessible, saving you time while ensuring high-quality knowledge acquisition.</p>
              </div>
              <AnimatePresence>
                {showBox && (
                    <motion.div
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeIn" } }}
                    exit={{ opacity: 0, x: 500, transition: { duration: 0.7, ease: "easeOut" } }}
                    className="display-box h-[80px] w-[300px] bg-black absolute top-5 lg:right-5 rounded-md px-3 py-2 sm:right-10"
                    >
                    <h1 className="text-yellow-400 font-text font-bold border-b pb-1 inline-block">
                        Perfect Research
                    </h1>
                    <p className="text-white font-text text-sm mt-3">
                        Please enter the publisher name
                    </p>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="create-by lg:text-xl border-t-4 border-t-amber-600 flex justify-center sm:text-sm">
                <p className='text-white text-center mt-5 font-text flex justify-center items-center gap-1 mb-4'>Created with <img src={Heart} alt="Heart" className='inline h-10 mix-blend-difference mb-1'/> by <span className='name text-yellow-500 font-name text-2xl relative'>Kushal Rathod</span></p>
            </div>
        </div>
    </>
  )
};

export default Popup;
