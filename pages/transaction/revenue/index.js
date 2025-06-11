import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BackButton from "components/buttons/BackButton";

export default function CreateRevenuePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    value: "",
    category: "",
    type: "revenue",
    addAt: new Date().toISOString().split("T")[0],
    paidAt: new Date().toISOString().split("T")[0],
  });

  const selectClass = "w-full border rounded px-3 py-2 pr-8";

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "value") {
      const numeric = value.replace(/\D/g, "");
      const float = (parseInt(numeric, 10) / 100).toFixed(2);
      setForm((prev) => ({
        ...prev,
        value: isNaN(float) ? "" : `R$ ${float.replace(".", ",")}`,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formattedValue = parseFloat(
      form.value.replace(/[^0-9,-]+/g, "").replace(",", "."),
    );

    const response = await fetch(`/api/v1/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        title: form.title,
        value: formattedValue,
        category: form.category,
        type: form.type,
        addAt: form.addAt,
        paidAt: form.paidAt,
      }),
    });

    if (response.status == "201") {
      router.back();
    }
  }

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setUserId(userIdFromStorage);

    const fetchData = async () => {
      const response = await fetch(
        `/api/v1/categories/${userIdFromStorage}/revenues`,
      );

      const data = await response.json();
      setCategories(data);
    };

    fetchData();
  }, [setCategories]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800">Nova Transação</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Valor com máscara */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="text"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="R$ 0,00"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={selectClass}
              required
            >
              <option value="">Selecione</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Data de Registro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Registro
            </label>
            <input
              type="date"
              name="addAt"
              value={form.addAt}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Data de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Pagamento
            </label>
            <input
              type="date"
              name="paidAt"
              value={form.paidAt}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
          >
            Salvar Entrada
          </button>
        </form>
      </div>
    </div>
  );
}
