import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { opend_backend } from "../../../declarations/opend_backend/index";
import Item from "./Item";

function Minter() {
  const { register, handleSubmit } = useForm();
  const [NFTID, setNFTID] = useState("");
  const [loaderHidden, setLoading] = useState(true);

  async function onSubmit(data) {
    setLoading(false);
    try {
      const name = data.name;
      const image = data.image[0];
      const imageByteData = [...new Uint8Array(await image.arrayBuffer())];

      const newNFTID = await opend_backend.mint(imageByteData, name);
      setLoading(true);
      setNFTID(newNFTID.toText());
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  }

  if (NFTID == "") {
    return (
      <div className="minter-container">
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <div className="upload-container">
            <input
              {...register("image", { required: true })}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">
              Mint NFT
            </span>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item {...{ NFTID }} />
        </div>
      </div>
    );
  }
}

export default Minter;
