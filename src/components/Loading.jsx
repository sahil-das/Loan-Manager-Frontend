// src/components/Loading.jsx
import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../assets/loading.json"; // adjust path

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: "150px", width: "150px" }}
      />
    </div>
  );
};

export default Loading;
