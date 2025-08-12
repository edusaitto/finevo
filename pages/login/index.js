import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SubmitButton from "components/buttons/SubmitButton";
import { showErrorToast } from "utils/showToast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(`/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const json = await response.json();

      if (response.status !== 201) {
        showErrorToast({ error: json.message });
        return;
      }

      localStorage.setItem("userId", json.userId);

      router.push("/");
    } catch (e) {
      showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <SubmitButton
            text="Entrar"
            loading={loading}
            loadingMessage="Acessando..."
          />
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Ainda não tem conta?
          <Link
            href="/user/create"
            className="text-blue-600 hover:underline cursor-pointer ml-1"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
