import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import SubmitButton from "components/buttons/SubmitButton";
import { showErrorToast, showSuccessToast } from "utils/showToast";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        title: "Erro!",
        text: "As senhas não coincidem!",
        icon: "error",
        confirmButtonText: "OK",
        toast: true,
        position: "top-end",
        timer: 4500,
        timerProgressBar: true,
      });

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const json = await response.json();

      if (response.status !== 201) {
        showErrorToast({ error: json.message });
        return;
      }

      showSuccessToast({ message: "Usuário cadastrado com sucesso!" });

      router.back();
    } catch (e) {
      showErrorToast();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <SubmitButton text="Cadastrar" loading={loading} />
        </form>
      </div>
    </div>
  );
}
