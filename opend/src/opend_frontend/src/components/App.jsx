import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Header />
      <img className="bottom-space" src="./home-img.png" />
      <Footer />
    </div>
  );
}

export default App;
