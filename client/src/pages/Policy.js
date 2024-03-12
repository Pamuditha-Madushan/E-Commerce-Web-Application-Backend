import React from "react";
import Layout from "../components/Layout/Layout";


const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>

      <div className="row contactus ">

        <div className="col-md-6 ">
          <img
            src="https://assets1.chainstoreage.com/styles/primary_articles_short/s3/2020-06/ecommerce2_0.jpg?itok=oPvSXVwT"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>

        <div className="col-md-4">
        <h1 className="bg-dark p-2 text-white text-center">PRIVACY</h1>
          <br />
          <p>✒️ We offer free shipping on all orders within the United States.</p>
           <p>✒️ Shipping costs for returns are the responsibility of the customer.</p>
          <p>✒️ Products must be returned in their original condition and packaging.</p>
          <p>✒️ Orders are typically processed and shipped within 1-2 business days.</p>
          <p>✒️ You can contact us via email, phone, or live chat.</p>
          </div>

      </div>

    </Layout>
  );
};

export default Policy;