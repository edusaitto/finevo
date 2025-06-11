import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState("Junho");
  const [expenses, setExpenses] = useState([]);

  const months = ["Maio", "Junho", "Julho"];

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/v1/transaction/user/${userId}`);
      const data = await response.json();
      setExpenses(data);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Financeiro
        </h1>

        <div className="flex justify-end">
          {/* Botão cadastrar nova categoria */}
          <div className="flex justify-end mr-2">
            <Link href="/category">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
                Nova categoria
              </button>
            </Link>
          </div>

          {/* Botão cadastrar nova receita */}
          <div className="flex justify-end mr-2">
            <Link href="/transaction/revenue">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
                Nova receita
              </button>
            </Link>
          </div>

          {/* Botão cadastrar nova transação */}
          <div className="flex justify-end">
            <Link href="/transaction/expense">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
                Nova despesa
              </button>
            </Link>
          </div>
        </div>

        {/* Seção 1 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Resumo de saldos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Saldo Atual" value="R$ 3.200,00" />
            <Card title="Checkpoint" value="R$ 3.800,00" />
            <Card title="Fim do Mês" value="R$ 4.100,00" />
          </div>
        </section>

        {/* Seção 2 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Gastos por período
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Gastos do Dia" value="R$ 120,00" />
            <Card title="Gastos da Semana" value="R$ 750,00" />
            <Card title="Gastos do Mês" value="R$ 1.000,00" />
          </div>
        </section>

        {/* Aba de troca de mês */}
        {/* <div className="flex gap-2 mt-6">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedMonth === month
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {month}
            </button>
          ))}
        </div> */}

        {/* Lista de gastos do mês selecionado */}
        <section className="bg-white rounded-xl shadow p-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Gastos de {selectedMonth}
          </h3>

          {/* Cabeçalho */}
          <div className="flex text-sm font-semibold text-gray-600 border-b pb-2">
            <span className="w-1/4">Data</span>
            <span className="w-1/4">Nome</span>
            <span className="w-1/4">Tipo</span>
            <span className="w-1/4 text-right">Valor</span>
          </div>

          {/* Linhas */}
          <ul className="mt-2 space-y-2">
            {expenses.map((item, index) => (
              <li
                key={index}
                className="flex items-center text-sm text-gray-700 border-b pb-2"
              >
                <span className="w-1/4">{formatDate(item.paid_at)}</span>
                <span className="w-1/4">{item.title}</span>
                <span className="w-1/4 ">
                  {item.type_title === "revenue" ? "Receita" : "Despesa"}
                </span>
                <span className="w-1/4 text-right font-medium">
                  {formatCurrency(item.value)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

// Componente de Card reutilizável
function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user } };
  } catch (err) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
