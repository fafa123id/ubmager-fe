import Swal from "sweetalert2";

export const useSwal = () => {
  function confirmAction(
    title = "Anda yakin?",
    text = "Tindakan ini tidak dapat dibatalkan!",
    icon = "warning"
  ) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, lanjutkan!",
      cancelButtonText: "Batal",
    });
  }

  function showSuccess(
    text = "Data Anda telah disimpan."
  ) {
    return Swal.fire({
      title: "Berhasil!",
      text: text,
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  }
  function showError(
    text = "Terjadi kesalahan. Silakan coba lagi."
  ) {
    return Swal.fire({
      title: "Gagal!",
      text: text,
      icon: "error",
      timer: 1000,
      showConfirmButton: false,
    });
  }
  return {
    confirmAction,
    showSuccess,
    showError
  };
};
