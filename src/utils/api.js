import axios from "axios";
import axiosClient from "./axios";

export const uploadImage = (base64) => {
  return axiosClient.post("image/sendImageAndGetLink", { image: base64 }).then((res) => {
    return res.data;
  });
};

export const getAreaByAreaId = async (MaKhuVuc) => {
  return axiosClient.post(`area/getAreaByAreaId`, { MaKhuVuc }).then((res) => {
    return res.data;
  });
};

export const getAllArea = async () => {
  return axiosClient.get(`area/getAllArea`).then((res) => {
    return res.data;
  });
};

export const addNewArea = async (area) => {
  return axiosClient.post(`area/addArea`, area).then((res) => {
    return res.data;
  });
};

export const updateArea = async (area) => {
  return axiosClient.post(`area/updateArea`, area).then((res) => {
    return res.data;
  });
};

export const getAreaById = async (id) => {
  return axiosClient.get(`area/getAreaById/${id}`).then((res) => {
    return res.data;
  });
};

export const deleteAreaById = async (id) => {
  return axiosClient.post(`area/deleteArea`, id).then((res) => {
    return res.data;
  });
};

export const getAllRoom = async () => {
  return axiosClient.get(`room/getAllRoom`).then((res) => {
    return res.data;
  });
};

export const getCustomerByUserId = async (id) => {
  return axiosClient.post(`customer/getCustomerByUserId`, { MaTaiKhoan: id }).then((res) => {
    return res.data;
  });
};

export const getOrderByUser = async (id) => {
  return axiosClient.post(`order/getOrderByUser`, { MaKhachHang: id }).then((res) => {
    return res.data;
  });
};

export const getOrderDetailByOrder = async (id) => {
  return axiosClient.post(`order/getOrderDetailByOrder`, { MaPhieuDat: id }).then((res) => {
    return res.data;
  });
};

export const getOneMenu = async (id) => {
  return axiosClient.get(`menu/getOneMenu/${id}`).then((res) => {
    return res.data;
  });
};

export const getOrderById = async (id) => {
  return axiosClient.post(`order/getOrderById`, { id }).then((res) => {
    return res.data;
  });
};

export const getAllDish = async () => {
  return axiosClient.get(`menu/getAllMenu`).then((res) => {
    return res.data;
  });
  // const res = await axiosClient.get(`menu/getAllMenu`);
  // return res.data;
};

export const getAllTypeOfDish = async () => {
  return axiosClient.get(`typeOfMenu/getAllTypeOfMenu`).then((res) => {
    return res.data;
  });
};

export const getMenuByAll = async (filter) => {
  return axiosClient.post(`menu/getMenuByAll`, filter).then((res) => {
    return res.data;
  });
};

// export const getMenuByTypeId = async (id) => {
//   return axiosClient.get(`menu/getMenuByTypeMenuId`, { MaLoai: id }).then((res) => {
//     return res.data;
//   });
// };
