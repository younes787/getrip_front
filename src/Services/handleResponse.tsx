import { Bounce, toast } from "react-toastify";

export const handleResponse = (response: any, requestType?: string) => {
  if (response === undefined) {
    handleError(response.data);
  }

  if (response.status === 200) {
    if (requestType === "Post" || requestType === "Delete") {
      handleSuccess(response?.data);
    }

    if (requestType === "Post" || requestType === "Delete") {
      window.location?.replace(window.location?.href);
    }
    return response.data;
  } else {
    handleError(response.response.data.errors);
  }
};

export const handleError = (error: any) => {
  toast(error?.response?.data?.title, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition: Bounce,
  });
};

export const handleSuccess = (response: any) => {
  toast("The process was completed successfully", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
    style: { backgroundColor: "#caf1d8", color: "#1da750" },
  });
};
