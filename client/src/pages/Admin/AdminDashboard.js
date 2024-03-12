import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";


const AdminDashboard = () => {

  const [auth] = useAuth();

  return (
    <Layout>

      <div className="container-fluid m-3 p-3 dashboard1">

        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">

          <img src="https://m16marketing.com/wp-content/uploads/2020/12/Top-10-E-Commerce-Trends-to-Embrace-in-2021.jpg" className="admin-image"/>

            <div className="admin-details">
              <h5> ADMIN NAME : {auth?.user?.name}</h5>
              <h5> ADMIN EMAIL : {auth?.user?.email}</h5>
              <h5> ADMIN CONTACT : {auth?.user?.phone}</h5>
            </div>
          </div>

        </div>

      </div>

    </Layout>
  );
};

export default AdminDashboard;
