import React from "react";
import { NavLink } from "react-router-dom";


const UserMenu = () => {
  return (

    <div>

      <div className="text-center dashboard-menu">
        <div className="list-group">

          <h4>USER DASHBOARD</h4>

          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action user-sidebar"
          >
            Profile
          </NavLink>

          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action user-sidebar"
          >
            Orders
          </NavLink>

        </div>

      </div>

    </div>
  );
};

export default UserMenu;
