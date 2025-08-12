import Swal from "sweetalert2";

function showSuccessToast({ message }) {
  const _message = message || "Operação realizada com sucesso.";

  Swal.fire({
    title: "Sucesso!",
    text: _message,
    icon: "success",
    confirmButtonText: "OK",
    toast: true,
    position: "top-end",
    timer: 4500,
    timerProgressBar: true,
  });
}

function showErrorToast({ error } = {}) {
  const _error = error || "Ocorreu um erro inesperado.";

  Swal.fire({
    title: "Erro!",
    text: _error,
    icon: "error",
    confirmButtonText: "OK",
    toast: true,
    position: "top-end",
    timer: 4500,
    timerProgressBar: true,
  });
}

export { showSuccessToast, showErrorToast };
