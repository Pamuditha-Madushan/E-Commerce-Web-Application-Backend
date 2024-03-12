import React from "react";
import Layout from "../../src/components/Layout/Layout";


const About = () => {
  return (
    <Layout title={"About us - Ecommerce app"}>

      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="https://cdn.pixabay.com/photo/2019/06/15/16/06/online-4275963__340.jpg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>

        <div className="col-md-4">

        <h1 className="bg-dark p-2 text-white text-center">ABOUT</h1>
          <br />

          <p className="text-justify mt-2">
            Welcome to Triipy, your ultimate destination for all your travel needs. We are an online retailer specializing in travel gear, accessories, and essentials. Our mission is to provide you with high-quality products that make your travel experience comfortable and hassle-free.
            At Triipy, we understand the importance of seamless travel. That's why we've curated a wide range of products that cater to all your travel requirements, whether you're heading on a weekend getaway or a backpacking adventure. 
          </p>

        </div>

      </div>
      
    </Layout>
  );
};

export default About;