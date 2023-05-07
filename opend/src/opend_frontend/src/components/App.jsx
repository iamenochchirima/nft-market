import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./Item";
import Minter from "./Minter";

function App() {
  const NFTID = "sgymv-uiaaa-aaaaa-aaaia-cai";

  return (
    <div className="App">
      <Header />
      <Minter />
      {/* <Item {...{NFTID}}/> */}
      {/* <img className="bottom-space" src="./home-img.png" /> */}
      <Footer />
    </div>
  );
}

export default App;
