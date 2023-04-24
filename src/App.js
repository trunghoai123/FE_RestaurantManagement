import "./styles/index.scss";
import "./styles/__reset.scss";

import React, { useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/customer/HomePage";
import Introduce from "./pages/customer/Introduce";
import Service from "./pages/customer/Service";
import Dishes from "./pages/customer/Dishes";
import AppAdmin from "./pages/admin/AppAdmin";
import AreaAdmin from "pages/admin/Area/AreaAdmin";
import RoomAdmin from "pages/admin/Room/RoomAdmin";
import TableAdmin from "pages/admin/Table/TableAdmin";
import AreaEditAdmin from "pages/admin/Area/AreaEditAdmin";
import RoomEditAdmin from "pages/admin/Room/RoomEditAdmin";
import { Provider } from "react-redux";
import store from "store/index";
import { SnackbarProvider } from "notistack";
import Orders from "pages/customer/Orders";
import AppCustomer from "pages/customer/AppCustomer";
import { AuthContext, AuthProvider } from "utils/context/AuthContext";
import NotFound from "components/NotFound/NotFound";
import { FormStateProvider } from "utils/context/FormStateContext";
import OrderAdmin from "pages/admin/Order/OrderAdmin";
import OrderDetailAdmin from "pages/admin/Order/OrderDetailAdmin";
import AddOrderAdmin from "pages/admin/Order/AddOrderAdmin";
import DishAdmin from "pages/admin/Dish/DishAdmin";
import Profile from "pages/customer/Profile";
import AreaSearch from "pages/admin/Area/AreaSearch";
import RoomSearch from "pages/admin/Room/RoomSearch";
import TableSearch from "pages/admin/Table/TableSearch";
import Area from "pages/customer/Area";
import Room from "pages/customer/Room";
import DishSearch from "pages/admin/Dish/DishSearch";
import AddInvoiceAdmin from "pages/admin/Invoice/AddInvoiceAdmin";
import InvoiceAdmin from "pages/admin/Invoice/InvoiceAdmin";
import InvoiceDetailAdmin from "pages/admin/Invoice/InvoiceDetailAdmin";

const App = (props) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <FormStateProvider>
          <SnackbarProvider autoHideDuration={4000} />
          <RouterProvider router={router}></RouterProvider>
        </FormStateProvider>
      </AuthProvider>
    </Provider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppCustomer></AppCustomer>,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
      {
        path: "orders",
        element: <Orders></Orders>,
      },
      {
        path: "dishes",
        element: <Dishes></Dishes>,
      },
      {
        path: "area",
        element: <Area></Area>,
      },
      {
        path: "room",
        element: <Room></Room>,
      },

      {
        path: "introduce",
        element: <Introduce></Introduce>,
      },
      {
        path: "service",
        element: <Service></Service>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
    ],
  },
  {
    path: "/admin",
    element: <AppAdmin></AppAdmin>,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        path: "",
        element: <HomePage></HomePage>,
        errorElement: <NotFound></NotFound>,
      },
      {
        path: "area/update",
        element: <AreaAdmin></AreaAdmin>,
      },
      {
        path: "area/search",
        element: <AreaSearch></AreaSearch>,
      },
      {
        path: "room/update",
        element: <RoomAdmin></RoomAdmin>,
      },
      {
        path: "room/search",
        element: <RoomSearch></RoomSearch>,
      },
      {
        path: "table/update",
        element: <TableAdmin></TableAdmin>,
      },
      {
        path: "table/search",
        element: <TableSearch></TableSearch>,
      },
      {
        path: "order/add",
        element: <AddOrderAdmin></AddOrderAdmin>,
      },
      {
        path: "order/update",
        element: <OrderAdmin></OrderAdmin>,
      },
      {
        path: "dish/search",
        element: <DishSearch></DishSearch>,
      },
      {
        path: "order/:orderId",
        element: <OrderDetailAdmin></OrderDetailAdmin>,
      },
      {
        path: "invoice/add",
        element: <AddInvoiceAdmin></AddInvoiceAdmin>,
      },
      {
        path: "invoice/:invoiceId",
        element: <InvoiceDetailAdmin></InvoiceDetailAdmin>,
      },
      {
        path: "invoice/update",
        element: <InvoiceAdmin></InvoiceAdmin>,
      },
    ],
  },
]);

App.propTypes = {};

export default App;
