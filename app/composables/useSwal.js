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
      background: "rgba(15,23,42,0.95)", // gelap elegan
      color: "#f8fafc",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, lanjutkan!",
      cancelButtonText: "Batal",
    });
  }
  function close() {
    return Swal.close();
  }
  function showSuccess(text = "Data Anda telah disimpan.") {
    return Swal.fire({
      title: "Berhasil!",
      text: text,
      icon: "success",
      timer: 1000,
      background: "rgba(15,23,42,0.95)", 
      color: "#f8fafc",
      showConfirmButton: false,
    });
  }
  function showError(text = "Terjadi kesalahan. Silakan coba lagi.") {
    return Swal.fire({
      title: "Gagal!",
      text: text,
      icon: "error",
      timer: 1000,
      background: "rgba(15,23,42,0.95)", // gelap elegan
      color: "#f8fafc",
      showConfirmButton: false,
    });
  }
  function showLoading(
    title = "Memproses...",
    text = "Mohon tunggu sebentar."
  ) {
    return Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      showConfirmButton: false,
      background: "rgba(15,23,42,0.95)", // gelap elegan
      color: "#f8fafc",
    });
  }
  return {
    close,
    confirmAction,
    showSuccess,
    showError,
    showLoading,
  };
};
