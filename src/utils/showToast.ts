import { toast, TypeOptions } from "react-toastify";

export function showToast(message: React.ReactNode, type:TypeOptions) {
  toast(message, {
    type
  })
}