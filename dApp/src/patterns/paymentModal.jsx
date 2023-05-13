import React from "react";
import { motion, AnimatePresence } from "framer-motion";

//IMPORTING MEDIA ASSETS

import close from "../assets/icons/close.svg";
import process from "../assets/icons/process.svg";
import loader from "../assets/icons/loader.gif";
import success from "../assets/icons/success.svg";
import error from "../assets/icons/error.svg";
import check_big from "../assets/icons/check_big.svg";
import error_outline from "../assets/icons/error_outline.svg";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, transform: "translate(-50%, -50%) scale(0.5)" },
  visible: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: { delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
    top: "-100vh",
  },
};

const PaymentModal = ({
  variant,
  type,
  isModal,
  setIsModal,
  title,
  description,
  footerText,
}) => {
  const renderHeaderImage = (type) => {
    switch (type) {
      case "success":
        return success;
      case "error":
        return error;
      default:
        return process;
    }
  };

  const getFooterImage = (type) => {
    switch (type) {
      case "success":
        return check_big;
      case "error":
        return error_outline;
      default:
        return loader;
    }
  };

  const getClassName = (type) => {
    switch (type) {
      case "success":
        return "text_greendark_14";
      case "error":
        return "text_error_14";
      default:
        return "text_accent_primary_14";
    }
  };

  const renderScreen = (
    <AnimatePresence>
      {isModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal_header">
              <img src={renderHeaderImage(type)} alt="payment" width={40} />
              {type !== "process" && (
                <img
                  src={close}
                  alt="close"
                  width={22}
                  onClick={() => setIsModal(false)}
                />
              )}
            </div>
            <div>
              <p className={getClassName(type)} style={{ fontSize: 16 }}>
                {title}
              </p>
              <p
                className="text_accent_primary_14"
                style={{ fontWeight: "normal" }}
              >
                {description}
              </p>
            </div>
            <div className="modal_footer">
              <img src={getFooterImage(type)} alt="payment" width={36} />
              <p>{footerText}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return renderScreen;
};

export default PaymentModal;
