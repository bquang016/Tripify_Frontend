// src/components/common/Modal/ModalPortal.jsx
import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
  const root = document.getElementById("modal-root") || document.body;
  return createPortal(children, root);
}
