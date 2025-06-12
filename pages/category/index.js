import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BackButton from "components/buttons/BackButton";
import Swal from "sweetalert2";

export default function CreateCategory() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("#00acc1");
  const [types, setTypes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    await fetch("/api/v1/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, color, type }),
    });

    Swal.fire({
      title: "Sucesso!",
      text: "Categoria cadastrada com sucesso!",
      icon: "success",
      confirmButtonText: "OK",
      toast: true,
      position: "top-end",
      timer: 4500,
      timerProgressBar: true,
    });
    router.push("/");
  };

  function handleChange(e) {
    const { value } = e.target;
    setType(value);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/v1/types`);

      const data = await response.json();
      setTypes(data);
    };

    fetchData();
  }, [setTypes]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <BackButton />
          <h2 className="text-xl font-bold text-gray-700">Nova Categoria</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              name="type"
              value={type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 pr-8"
              required
            >
              <option value="">Selecione</option>
              {types.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title == "expense" ? "Despesa" : "Receita"}
                </option>
              ))}
            </select>
          </div>

          {/* Cor */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Cor</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 p-1 rounded-xl border border-gray-300"
              />
              <span className="text-gray-600">{color}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded-xl shadow hover:bg-cyan-700 transition"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
