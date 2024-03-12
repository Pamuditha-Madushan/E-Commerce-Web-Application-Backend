import React from "react";
import Layout from "../../../src/components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";



const Dashboard = () => {

  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>

      <div className="container-flui m-3 p-3 dashboard1">

        <div className="row">

          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9 ">

          <img src="https://m16marketing.com/wp-content/uploads/2020/12/Top-10-E-Commerce-Trends-to-Embrace-in-2021.jpg" className="admin-image"/>

            <div className="admin-details">
              <h5 >USER NAME: {auth?.user?.name}</h5>
              <h5>USER EMAIL: {auth?.user?.email}</h5>
              <h5>USER ADDRESS: {auth?.user?.address}</h5>
            </div>
          </div>

        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;
