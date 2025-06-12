import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BackButton from "components/buttons/BackButton";

export default function CreateExpensePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    title: "",
    value: "",
    category: "",
    type: "expense",
    addAt: new Date().toISOString().split("T")[0],
    paidAt: new Date().toISOString().split("T")[0],
    creditCard: "",
    bill: "",
    repeat: 1,
    fixed: false,
  });

  const selectClass = "w-full border rounded px-3 py-2 pr-8";

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "value") {
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
        paidAt: form.paidAt,
        addAt: form.addAt,
        creditCard: form.creditCard,
        bill: form.bill,
        repeat: form.repeat,
        fixed: form.fixed,
      }),
    });

    if (response.status == "201") {
      router.back();
    }
  }

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setUserId(userIdFromStorage);

    const fetchCategories = async () => {
      const response = await fetch(
        `/api/v1/categories/${userIdFromStorage}/expenses`,
      );

      const data = await response.json();
      setCategories(data);
    };

    const fetchCards = async () => {
      const response = await fetch(`/api/v1/cards/${userIdFromStorage}`);

      const data = await response.json();
      setCards(data);
    };

    fetchCategories();
    fetchCards();
  }, [setCategories]);

  useEffect(() => {
    const fetchBills = async () => {
      const response = await fetch(`/api/v1/bills/${form.creditCard}`);

      const data = await response.json();
      setBills(data);
    };

    if (form.creditCard) {
      fetchBills();
    }
  }, [form.creditCard]);

  useEffect(() => {
    if (form.bill) {
      const _bill = bills.find((b) => b.id === form.bill);

      setForm((prev) => ({
        ...prev,
        paidAt: _bill.payment_date.split("T")[0],
      }));
    }
  }, [form.bill, bills]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800">Nova despesa</h1>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forma de pagamento
            </label>
            <select
              name="creditCard"
              value={form.creditCard}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Débito</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox de fixo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="fixed"
              checked={form.fixed}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="fixed" className="text-sm text-gray-700">
              É fixo?
            </label>
          </div>

          {!form.fixed && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                {form.creditCard ? "Parcelas" : "Recorrência"}
              </label>
              <input
                name="repeat"
                type="number"
                min="1"
                max="24"
                value={form.repeat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {form.creditCard && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fatura
                </label>
                <select
                  name="bill"
                  value={form.bill}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Selecione a fatura</option>
                  {bills.map((bill) => (
                    <option key={bill.id} value={bill.id}>
                      {bill.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data de Registro da despesa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Registro da Despesa
                </label>
                <input
                  type="date"
                  name="addAt"
                  value={form.addAt}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </>
          )}

          {/* Data de Pagamento no fim */}
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
            Salvar despesa
          </button>
        </form>
      </div>
    </div>
  );
}
