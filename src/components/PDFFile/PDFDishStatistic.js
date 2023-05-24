import React, { useEffect, useState } from "react";
import { Page, Text, Image, Document, StyleSheet, View } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import { convertDate, convertInterDate } from "pages/admin/Order/OrderAdmin";
import { convertToVND, removeVietnameseTones } from "utils/utils";
import { getEmployeeById } from "utils/api";

const styles = StyleSheet.create({
  body: {
    padding: "10px",
    fontSize: "13px",
  },
  viewFlex: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "13px",
    // columnGap: "20px",
    justifyContent: "space-between",
  },
  viewFlexTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "13px",
    margin: "12px 0 8px 0",
    justifyContent: "space-between",
  },
  viewFlexTitleRight: {
    textAlign: "right",
    flexDirection: "row",
    fontSize: "13px",
    margin: "12px 0 8px 0",
    justifyContent: "space-between",
  },
  normalText: {
    marginBottom: "4px",
  },
  columnDish: {
    width: "20%",
    marginBottom: "6px",
  },
  columnDish_10: {
    width: "10%",
    marginBottom: "6px",
  },
  columnDish_30: {
    width: "30%",
    marginBottom: "6px",
  },
  columnDishLong: {
    width: "40%",
    marginBottom: "6px",
  },
  columnDish33: {
    width: "33%",
  },
  logo: {
    width: "60px",
    height: "60px",
  },
  topInforRight: {
    marginLeft: "auto",
  },
  topResName: {
    fontSize: "25px",
  },
});

const PDFDishStatistic = ({ dishes = [] }) => {
  const [staff, setStaff] = useState(null);

  const sumRoomPrice = () => {
    let sum = 0;
    if (dishes?.LoaiHoaDon !== 0) {
      sum =
        dishes?.LoaiHoaDon === 1
          ? dishes?.ListPhong?.length * 100000
          : dishes?.ListPhong?.length * 300000;
    }
    return sum;
  };
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const data = await getEmployeeById(dishes?.MaNhanVien);
        if (data?.data) {
          setStaff(data.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    loadInfor();
  }, []);

  const sumDishes = (dishes) => {
    console.log(dishes);
    let sum = 0;
    if (dishes?.length) {
      dishes.forEach((dish) => {
        const { GiaMon, SoLuongBan } = dish;
        sum += GiaMon * SoLuongBan;
      });
    }
    return sum;
  };

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.viewFlex}>
          <View>
            <Image style={styles.logo} src="/images/logo.png" />
          </View>
          <View>
            <Text style={styles.topResName}>Evergreen Garden</Text>
          </View>
        </View>
        <View style={styles.normalText}>
          <Text>Thoi gian xuat: {convertInterDate(new Date())}</Text>
        </View>
        <View style={styles.viewFlexTitle}>
          <Text style={styles.columnDish}>Ma mon</Text>
          <Text style={styles.columnDish_30}>Ten mon</Text>
          <Text style={styles.columnDish}>Gia</Text>
          <Text style={styles.columnDish_10}>So luong</Text>
          <Text style={styles.columnDish}>Doanh thu</Text>
        </View>
        {dishes?.map((dish) => {
          return (
            <View key={dish._id} style={styles.viewFlex}>
              <Text style={styles.columnDish}>{dish?._id?.slice(0, 5)}</Text>
              <Text style={styles.columnDish_30}>
                {dish?.TenMon && removeVietnameseTones(dish?.TenMon)}
              </Text>
              <Text style={styles.columnDish}>{dish?.GiaMon}</Text>
              <Text style={styles.columnDish_10}>{dish?.SoLuongBan}</Text>
              <Text style={styles.columnDish}>{dish?.SoLuongBan * dish?.GiaMon}</Text>
            </View>
          );
        })}
        <View>
          <Text style={styles.viewFlexTitleRight}>
            Tong tien thong ke: {convertToVND(sumDishes(dishes)) + " vnd"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

PDFDishStatistic.propTypes = {};

export default PDFDishStatistic;
