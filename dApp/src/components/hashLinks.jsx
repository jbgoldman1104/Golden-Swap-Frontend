import React from "react";
import "../styles/components/hashLinks.scss";

import hash from "../assets/icons/hash2.svg";
import copy from "../assets/icons/copy2.svg";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";

function HashLinks({ variant, data }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const primaryHashLinks = (
    <div className="hashLink">
      <p className="primary">
        <img src={hash} alt="hash#" />
        <span className="text_accent_primary_865">{`${data?.slice(
          0,
          8
        )}...${data?.slice(data?.length - 3)}`}</span>
      </p>
      <CopyToClipboard text={data}>
        <img src={copy} alt="copy" onClick={() => handleCopy()} />
      </CopyToClipboard>
      <span className={isCopied ? "copy_text active" : "copy_text"}>
        copied
      </span>
    </div>
  );

  const secondaryHashLinks = (
    <div>
      <p>
        <img src="" alt="hash#" />
        <span>{data}</span>
      </p>
    </div>
  );

  switch (variant) {
    case "primary":
      return primaryHashLinks;
    case "secondary":
      return secondaryHashLinks;
    default:
      return null;
  }
}

export default HashLinks;
