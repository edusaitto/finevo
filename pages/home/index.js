import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [dailyExpenses, setDailyExpenses] = useState();
  const [weeklyExpenses, setWeeklyExpenses] = useState();
  const [monthlyExpenses, setMonthlyExpenses] = useState();
  const [currentBalance, setCurrentBalance] = useState();
  const [forecastCheckpoint, setForecastCheckpoint] = useState();
  const [forecastEndOfMonth, setForecastEndOfMonth] = useState();
  const [months, setMonths] = useState([]);

  const [expenses, setExpenses] = useState([]);

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

      const responseTotals = await fetch(`/api/v1/home/${userId}`);
      const dataTotals = await responseTotals.json();
      setDailyExpenses(formatCurrency(dataTotals.day));
      setWeeklyExpenses(formatCurrency(dataTotals.week));
      setMonthlyExpenses(formatCurrency(dataTotals.month));
      setCurrentBalance(formatCurrency(dataTotals.currentBalance));
      setForecastCheckpoint(formatCurrency(dataTotals.forecastCheckpoint));
      setForecastEndOfMonth(formatCurrency(dataTotals.forecastEndOfMonth));

      const responseMonths = await fetch(
        `/api/v1/transaction/user/${userId}/months`,
      );
      const dataMonths = await responseMonths.json();
      const translatedMonths = dataMonths.map(({ monthNumber, monthName }) => ({
        number: monthNumber,
        label: monthsPt[monthName] || monthName,
      }));

      setMonths(translatedMonths);

      if (translatedMonths.length == 1) {
        setSelectedMonth(translatedMonths[0]);
      } else if (translatedMonths.length > 1) {
        const currentMonthNumber = new Date().getMonth() + 1;

        const currentMonthLabel = translatedMonths.find(
          (m) => m.monthNumber === currentMonthNumber,
        );

        setSelectedMonth(
          { number: currentMonthNumber, label: currentMonthLabel } ??
            translatedMonths[0],
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/v1/transaction/user/${userId}?monthNumber=${selectedMonth.number}`,
      );
      const data = await response.json();
      if (data) setExpenses(data);
    };

    if (selectedMonth != undefined) {
      fetchData();
    }
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Financeiro
        </h1>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          {/* Botão cadastrar nova categoria */}
          <Link href="/category" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
              Nova categoria
            </button>
          </Link>

          {/* Botão cadastrar nova receita */}
          <Link href="/transaction/revenue" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
              Nova receita
            </button>
          </Link>

          {/* Botão cadastrar nova transação */}
          <Link href="/transaction/expense" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
              Nova despesa
            </button>
          </Link>
        </div>

        {/* Seção 1 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Resumo de saldos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Saldo Atual" value={currentBalance} />
            <Card title="Checkpoint (Dia 14)" value={forecastCheckpoint} />
            <Card title="Fim do Mês" value={forecastEndOfMonth} />
          </div>
        </section>

        {/* Seção 2 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Gastos por período
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Gastos do Dia" value={dailyExpenses} />
            <Card title="Gastos da Semana" value={weeklyExpenses} />
            <Card title="Gastos do Mês" value={monthlyExpenses} />
          </div>
        </section>

        {/* Aba de troca de mês */}
        <div className="flex gap-2 mt-6">
          {months.map((month) => (
            <button
              key={month.number}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedMonth != null &&
                (selectedMonth.number === month.number || months.length == 1)
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>

        {/* Lista de gastos do mês selecionado */}
        {selectedMonth && (
          <section className="bg-white rounded-xl shadow p-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Gastos de {selectedMonth.label}
            </h3>

            {/* Cabeçalho */}
            <div className="flex text-sm font-semibold text-gray-600 border-b pb-2">
              <span className="w-1/4">Data</span>
              <span className="w-1/2">Nome</span>
              <span className="w-1/4 text-right">Valor</span>
            </div>

            {/* Linhas */}
            <ul className="mt-2 space-y-2">
              {selectedMonth &&
                expenses.map((item, index) => {
                  const isRevenue = item.type_title === "revenue";
                  const valueColor = isRevenue
                    ? "text-green-600"
                    : "text-red-600";
                  const icon = isRevenue ? "↑" : "↓";

                  return (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-700 border-b pb-2"
                    >
                      <span className="w-1/4">{formatDate(item.paid_at)}</span>
                      <span className="w-1/2">{item.title}</span>
                      <span
                        className={`w-1/4 text-right font-medium flex justify-end items-center gap-1 ${valueColor}`}
                      >
                        {formatCurrency(item.value)} <span>{icon}</span>
                      </span>
                    </li>
                  );
                })}
            </ul>
          </section>
        )}
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

const monthsPt = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
};
