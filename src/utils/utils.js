export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
export const convertToVND = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const renderDate = (date) => {
  return (
    (new Date(date).getHours() < 10 ? "0" + new Date(date).getHours() : new Date(date).getHours()) +
    ":" +
    (new Date(date).getMinutes() < 10
      ? "0" + new Date(date).getMinutes()
      : new Date(date).getMinutes()) +
    " - " +
    new Date(date).toLocaleDateString()
  );
};
