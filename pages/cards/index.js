import { useState } from "react";
import { useRouter } from "next/router";
import BackButton from "components/buttons/BackButton";
import Swal from "sweetalert2";

export default function CreateCard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#00acc1");
  const [closingDay, setClosingDay] = useState(1);
  const [paymentDay, setPaymentDay] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    await fetch("/api/v1/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, color, paymentDay, closingDay }),
    });

    Swal.fire({
      title: "Sucesso!",
      text: "Cartão cadastrado com sucesso!",
      icon: "success",
      confirmButtonText: "OK",
      toast: true,
      position: "top-end",
      timer: 4500,
      timerProgressBar: true,
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <BackButton />
          <h2 className="text-xl font-bold text-gray-700">Novo Cartão</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nome do Cartão
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Dia de fechamento da fatura*/}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Dia de fechamento da fatura
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={closingDay}
              onChange={(e) => setClosingDay(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Dia de vencimento */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Dia de Vencimento
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={paymentDay}
              onChange={(e) => setPaymentDay(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
