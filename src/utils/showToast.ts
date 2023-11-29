import { toast, TypeOptions } from "react-toastify";

export function showToast(message: string, type:TypeOptions) {
  toast(message, {
    type
  })
}