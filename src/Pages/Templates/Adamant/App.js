import React from "react";
import "./styles.css";
import AdamantMain from "./pages/AdamantMain";
import { ToastContainer } from "react-toastify";
import { Box } from "@mui/material";

export default function App() {
  return (
    <>
      <Box sx={{
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "white",
        border: "1px solid black",
      }}>
        <AdamantMain/>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={false}
        progress={undefined} />
    </>
  );
};