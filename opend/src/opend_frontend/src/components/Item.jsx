import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/index";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend_backend } from "../../../declarations/opend_backend/index";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item({ NFTID, role }) {
  const localHost = "http://127.0.0.1:8080/";
  const agent = new HttpAgent({ host: localHost });
  const id = NFTID;
  const [nftImage, setImage] = useState(null);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoading] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState()

  // TODO- When deploy live, remove the following line.
  agent.fetchRootKey();
  let NFTActor;

  // useEffect(() => {
  //   // window.location.reload();
  //   console.log(role)
  // }, [role]);

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const ownerPrinc = await NFTActor.getOwner();
    const rawImage = await NFTActor.getContent();
    const owner = ownerPrinc.toString();
    const imageContent = new Uint8Array(rawImage);
    const image = URL.createObjectURL(new Blob([imageContent.buffer,{type: "image/png",},]));
    setImage(image);
    setName(name);
    setOwner(owner);
    if (role == "collection") {
      const nftListed = await opend_backend.isListed(NFTID);
      if (nftListed) {
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" });
        setButton();
        setStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSale} text={"Sell"} />);
      }
    } else if (role == "discover") {
      const originalOwner = await opend_backend.getOriginalOwner(NFTID);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend_backend.getListedNFTPrice(NFTID);
      setPriceLabel(<PriceLabel sellPrice={price.toString()}  />)
    }
  }

  let price;

  const handleBuy = async () => {
    console.log("Buy was triggered");
  };

  const handleSale = () => {
    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItems} text={"Confirm"} />);
  };

  const sellItems = async () => {
    setBlur({ filter: "blur(4px)" });
    setLoading(false);
    const listingResult = await opend_backend.listItem(NFTID, Number(price));
    if (listingResult == "Success") {
      const openDId = await opend_backend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      if (transferResult == "Success") {
        setLoading(true);
        setButton();
        setPriceInput();
        setStatus("Listed");
      }
    }
  };

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={nftImage}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
