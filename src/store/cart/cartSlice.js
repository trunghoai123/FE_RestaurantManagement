import axiosClient from "utils/axios";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// const fetchDishes = async () => {
//   try {
//     const result = await axiosClient.get("menu/getAllMenu", {});
//     if (result?.data?.data) {
//       setDishes(result.data.data);
//     }
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// };
export const addToCartById = createAsyncThunk("cart/getCartById", async (dishId, thunkAPI) => {
  const response = await axiosClient.get(`menu/getOneMenu/${dishId}`, {});
  return response.data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("Restaurant-Cart")) || [],
    totalMoney: 0,
  },
  reducers: {
    clearCart(state, action) {
      state.cartItems = [];
      state.totalMoney = 0;
    },
    setTotalMoney(state, action) {
      state.totalMoney = action.payload;
    },
    reloadTotalMoney(state, action) {
      if (state.cartItems && state.cartItems.length > 0) {
        let sum = 0;
        state.cartItems.forEach((item) => {
          sum += item.GiaMon * item.SoLuong;
        });
        state.totalMoney = sum;
      }
    },
    removeCartItem(state, action) {
      const dishId = action.payload;
      let newCartItems = [...state.cartItems];
      if (state.cartItems && state.cartItems.length > 0) {
        const index = state.cartItems.findIndex((item) => item._id === dishId);
        if (index !== -1) {
          newCartItems.splice(index, 1);
          localStorage.removeItem("Restaurant-Cart");
          localStorage.setItem("Restaurant-Cart", JSON.stringify(newCartItems));
          state.cartItems = newCartItems;
          let sum = 0;
          state.cartItems.forEach((item) => {
            sum += item.GiaMon * item.SoLuong;
          });
          state.totalMoney = sum;
        }
      }
    },
    increaseCartItem(state, action) {
      const dishId = action.payload;
      let newCartItems = [...state.cartItems];
      if (state.cartItems && state.cartItems.length > 0) {
        const index = state.cartItems.findIndex((item) => item._id === dishId);
        if (index !== -1) {
          newCartItems[index] = {
            ...newCartItems[index],
            SoLuong: newCartItems[index].SoLuong + 1,
          };
          localStorage.removeItem("Restaurant-Cart");
          localStorage.setItem("Restaurant-Cart", JSON.stringify(newCartItems));
          state.cartItems = newCartItems;
          let sum = 0;
          state.cartItems.forEach((item) => {
            sum += item.GiaMon * item.SoLuong;
          });
          state.totalMoney = sum;
        }
      }
    },
    addToCartWidthAmount(state, action) {
      const { amount, dish } = action.payload;
      const dishId = dish._id;
      let newCartItems = [...state.cartItems];
      const index = state.cartItems.findIndex((item) => item._id === dishId);
      if (index !== -1) {
        newCartItems[index] = {
          ...newCartItems[index],
          SoLuong: newCartItems[index].SoLuong + amount,
        };
        state.cartItems = newCartItems;
        let sum = 0;
        state.cartItems.forEach((item) => {
          sum += item.GiaMon * item.SoLuong;
        });
        state.totalMoney = sum;
      } else {
        newCartItems.push({ ...dish, SoLuong: amount });
        state.cartItems = newCartItems;
        let sum = 0;
        state.cartItems.forEach((item) => {
          sum += item.GiaMon * item.SoLuong;
        });
        state.totalMoney = sum;
      }
      localStorage.removeItem("Restaurant-Cart");
      localStorage.setItem("Restaurant-Cart", JSON.stringify(newCartItems));
    },
    decreaseCartItem(state, action) {
      const dishId = action.payload;
      let newCartItems = [...state.cartItems];
      if (state.cartItems && state.cartItems.length > 0) {
        const index = state.cartItems.findIndex((item) => item._id === dishId);
        if (index !== -1) {
          if (newCartItems[index].SoLuong > 1) {
            newCartItems[index] = {
              ...newCartItems[index],
              SoLuong: newCartItems[index].SoLuong - 1,
            };
          } else {
            newCartItems.splice(index, 1);
          }
          localStorage.removeItem("Restaurant-Cart");
          localStorage.setItem("Restaurant-Cart", JSON.stringify(newCartItems));
          state.cartItems = newCartItems;
          let sum = 0;
          state.cartItems.forEach((item) => {
            sum += item.GiaMon * item.SoLuong;
          });
          state.totalMoney = sum;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartById.pending, (state, action) => {})
      .addCase(addToCartById.fulfilled, (state, action) => {
        if (action?.payload?.data) {
          const data = { ...action.payload.data };
          const jsonValues = localStorage.getItem("Restaurant-Cart");
          let parsedJson = JSON.parse(jsonValues);
          localStorage.removeItem("Restaurant-Cart");
          let newValues = [];
          if (Array.isArray(parsedJson) && parsedJson.length > 0) {
            // values = [{...}]
            newValues = [...parsedJson];
            const index = newValues.findIndex((item) => item._id === data._id);
            if (index !== -1) {
              newValues[index].SoLuong = newValues[index].SoLuong + 1;
            } else {
              newValues.push({ ...data, SoLuong: 1 });
            }
            localStorage.setItem("Restaurant-Cart", JSON.stringify(newValues));
          } else if (Array.isArray(parsedJson) && parsedJson.length === 0) {
            // values = []
            newValues.push({ ...data, SoLuong: 1 });
            localStorage.setItem("Restaurant-Cart", JSON.stringify(newValues));
          } else {
            // values = null
            newValues.push({ ...data, SoLuong: 1 });
            localStorage.setItem("Restaurant-Cart", JSON.stringify(newValues));
          }
          state.cartItems = newValues;
          state.totalMoney += data.GiaMon;
        }
      })
      .addCase(addToCartById.rejected, (state, action) => {
        console.log(action.payload);
        state.cartItems.push({ id: action.payload.id });
      });
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = cartSlice;
// Extract and export each action creator by name
export const {
  createCart,
  updateCart,
  clearCart,
  addToCart,
  setTotalMoney,
  reloadTotalMoney,
  removeCartItem,
  increaseCartItem,
  decreaseCartItem,
  addToCartWidthAmount,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
