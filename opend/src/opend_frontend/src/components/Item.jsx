import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/index";
import { Principal } from "@dfinity/principal";

function Item({ NFTID }) {
  const localHost = "http://127.0.0.1:8080/";
  const agent = new HttpAgent({ host: localHost });
  const id = NFTID;
  const [nftImage, setImage] = useState(null)
  const [name, setName] = useState("")
  const [owner, setOwner] = useState("")

  async function loadNFT() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName()
    const ownerPrinc = await NFTActor.getOwner()
    const rawImage = await NFTActor.getContent()
    const owner = ownerPrinc.toString()
    const imageContent = new Uint8Array(rawImage)
    const image = URL.createObjectURL(new Blob([imageContent.buffer, {
      type: "image/png",
    }]))
    setImage(image)
    setName(name)
    setOwner(owner)
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={nftImage}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
