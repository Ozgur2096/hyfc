import React, { useState } from "react";

function ImageUpload() {
  const [image, setImage] = useState("");

  function coverToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setImage(reader.result);
    };
    reader.onerror = function () {};
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner" style={{ width: "auto" }}>
        Upload image here
        <input accept="image/*" type="file" onChange={coverToBase64} />
        {image === "" || image === null ? (
          ""
        ) : (
          <img width={100} height={100} src={image} alt="" />
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
