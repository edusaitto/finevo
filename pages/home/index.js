import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import ActionButtons from "components/buttons/ActionButtons.js";

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [bills, setBills] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState();
  const [weeklyExpenses, setWeeklyExpenses] = useState();
  const [currentBalanceMonth, setCurrentBalanceMonth] = useState();
  const [forecastCheckpoint, setForecastCheckpoint] = useState();
  const [forecastEndOfMonth, setForecastEndOfMonth] = useState();
  const [currentRevenue, setCurrentRevenue] = useState();
  const [currentExpenses, setCurrentExpenses] = useState();
  const [months, setMonths] = useState([]);

  const [expenses, setExpenses] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const filteredExpenses = expenses.filter((item) => {
    if (filterType === "all") return true;
    return item.type_title === filterType;
  });

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

      const responseTotals = await fetch(
        `/api/v1/home/${userId}?month=${selectedMonth.number}&year=${selectedMonth.year}`,
      );
      const dataTotals = await responseTotals.json();
      setDailyExpenses(formatCurrency(dataTotals.day));
      setWeeklyExpenses(formatCurrency(dataTotals.week));

      setCurrentRevenue(formatCurrency(dataTotals.revenue));
      setCurrentExpenses(formatCurrency(dataTotals.expenses));

      setForecastCheckpoint(formatCurrency(dataTotals.forecastCheckpoint));
      setForecastEndOfMonth(formatCurrency(dataTotals.forecastEndOfMonth));
      setCurrentBalanceMonth(
        formatCurrency(dataTotals.currentBalanceCurrentMonth),
      );
    };

    if (selectedMonth) {
      fetchData();
    }
  }, [selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const responseMonths = await fetch(
        `/api/v1/transaction/user/${userId}/months`,
      );
      const dataMonths = await responseMonths.json();
      const translatedMonths = dataMonths.map(
        ({ monthNumber, monthName, year }) => ({
          number: monthNumber,
          label: monthsPt[monthName] || monthName,
          year: year,
        }),
      );

      setMonths(translatedMonths);

      if (!selectedMonth) {
        if (translatedMonths.length == 1) {
          setSelectedMonth(translatedMonths[0]);
        } else if (translatedMonths.length > 1) {
          const currentMonthNumber = new Date().getMonth() + 1;

          const currentMonthLabel = translatedMonths.find(
            (m) => m.monthNumber === currentMonthNumber,
          );

          setSelectedMonth(
            currentMonthLabel
              ? {
                  number: currentMonthNumber,
                  label: currentMonthLabel,
                  year: new Date().getFullYear(),
                }
              : translatedMonths[0],
          );
        }
      }
    };

    fetchData();
  }, [selectedMonth]);

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

  useEffect(() => {
    if (selectedMonth == undefined && months) {
      if (months.length == 1) {
        setSelectedMonth(months[0]);
      } else if (months.length > 1) {
        const currentMonthNumber = new Date().getMonth() + 1;

        const currentMonthLabel = months.find(
          (m) => m.monthNumber === currentMonthNumber,
        );

        setSelectedMonth(
          {
            number: currentMonthNumber,
            label: currentMonthLabel,
            year: new Date().getFullYear(),
          } ?? months[0],
        );
      }
    }
  }, [months, selectedMonth]);

  useEffect(() => {
    const fetchBills = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/v1/bills/user/${userId}?month=${selectedMonth.number}&year=${selectedMonth.year}`,
      );
      const data = await response.json();
      setBills(data);
    };

    if (selectedMonth) {
      fetchBills();
    }
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800">FINEVO</h1>

          <ActionButtons />
        </div>

        {/* Seção 1 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Resumo Atual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Gastos do Dia" value={dailyExpenses} />
            <Card title="Gastos da Semana" value={weeklyExpenses} />
            <Card title="Saldo Atual" value={currentBalanceMonth} />
          </div>
        </section>

        {/* Aba de troca de mês */}
        <div className="mt-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max whitespace-nowrap">
            {months.map((month) => (
              <button
                key={month.number}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedMonth != null &&
                  ((selectedMonth.number === month.number &&
                    selectedMonth.year === month.year) ||
                    months.length == 1)
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Resumo Mensal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Entradas" value={currentRevenue} />
            <Card title="Saídas" value={currentExpenses} />
            <Card title="Checkpoint (Dia 14)" value={forecastCheckpoint} />
            <Card title="Fim do Mês" value={forecastEndOfMonth} />
          </div>
        </section>

        {bills.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Faturas do Mês
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 bg-white shadow-md rounded-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: bill.color || "#ccc" }}
                    />
                    <span className="text-sm text-gray-600 font-medium">
                      {bill.card_title}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mb-1">
                    Vencimento:{" "}
                    {new Date(bill.payment_date).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </p>

                  <p className="text-2xl font-bold text-gray-800 text-right">
                    {formatCurrency(bill.total_value || 0)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lista de gastos do mês selecionado */}
        {selectedMonth && (
          <section className="bg-white rounded-xl shadow p-4 mt-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Gastos de {selectedMonth.label}
              </h3>

              <div className="flex gap-2 justify-end mb-3">
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === "all"
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFilterType("all")}
                >
                  Todos
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === "revenue"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFilterType("revenue")}
                >
                  Receitas
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === "expense"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFilterType("expense")}
                >
                  Despesas
                </button>
              </div>
            </div>

            {/* Cabeçalho */}
            <div className="overflow-x-auto w-full">
              <div className="min-w-[600px]">
                {" "}
                {/* largura mínima que faça sentido */}
                <div className="flex text-sm font-semibold text-gray-600 border-b pb-2">
                  <span className="w-1/4">Data</span>
                  <span className="w-1/4">Nome</span>
                  <span className="w-1/4">Categoria</span>
                  <span className="w-1/4 text-right">Valor</span>
                </div>
                {/* Linhas */}
                <ul className="mt-2 space-y-2">
                  {selectedMonth &&
                    filteredExpenses.map((item, index) => {
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
                          <span className="w-1/4">
                            {formatDate(item.paid_at)}
                          </span>
                          <span className="w-1/4">{item.title}</span>
                          <span className="w-1/4 flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full inline-block"
                              style={{ backgroundColor: item.category_color }}
                            ></span>
                            {item.category_title}
                          </span>
                          <span
                            className={`w-1/4 text-right font-medium flex justify-end items-center gap-1 ${valueColor}`}
                          >
                            {item.card_color && (
                              <div className="flex items-center gap-1 mr-1">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                                <span
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: item.card_color }}
                                ></span>
                              </div>
                            )}
                            {formatCurrency(item.value)}
                            <span>{icon}</span>
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
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
