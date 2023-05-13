import React from "react";
import { motion, AnimatePresence } from "framer-motion";
//STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING MEDIA ASSETS

import close from "../assets/icons/close.svg";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, transform: "translate(-50%, -50%) scale(2)" },
  visible: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: { delay: 0.5 },
  },
  exit: { opacity: 0, transform: "translate(-50%, -50%) scale(0)" },
};

const UserModal = ({
  variant,
  type,
  content,
  title,
  description,
  isModal,
  setIsModal,
  footerText,
}) => {
  const renderModalHeader = (
    <div className="modal_header">
      <div>
        <p className="text_accent_primary_14">{title}</p>
        <p className="text_accent_primary_10">{description}</p>
      </div>
      <img
        src={close}
        alt="close"
        width={22}
        onClick={() => setIsModal(false)}
      />
    </div>
  );

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
            {renderModalHeader}
            <div>{content}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return renderScreen;
};

export default UserModal;
