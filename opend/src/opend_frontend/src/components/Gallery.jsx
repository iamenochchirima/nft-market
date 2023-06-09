import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(props) {
  const [items, setItems] = useState();

  const getNFTs = () => {
    if (props.ids != undefined) {
      setItems(
        props.ids.map((NFTID) => <Item NFTID={NFTID} key={NFTID.toText()} role={props.role} />)
      );
    }
  };

  useEffect(() => {
    getNFTs();
  }, []);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
