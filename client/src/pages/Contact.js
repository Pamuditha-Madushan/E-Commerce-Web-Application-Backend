import React from "react";
import Layout from "../../src/components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>

      <div className="row contactus ">

        <div className="col-md-6 ">
          <img
            src="https://www.newswire.com/blog/wp-content/uploads/2019/01/ecommerce-shopping-cart-keyboard-ss-1920.jpg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>

        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <br />

          <p className="text-justify mt-2">
            Thank you for your interest in our products. If you have any questions or queries regarding our products, please feel free to contact us anytime as we are available 24X7 to assist you.
          </p>

          <br />

          <p className="mt-3">
            <BiMailSend /> : trippy@gmail.com
          </p>

          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>

          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>

        </div>

      </div>

    </Layout>
  );
};

export default Contact
