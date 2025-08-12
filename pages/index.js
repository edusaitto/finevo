import jwt from "jsonwebtoken";
import { useEffect, useState, useCallback } from "react";
import ActionButtons from "components/buttons/ActionButtons.js";
import MonthlySummary from "components/sections/home/MonthlySummary.js";
import { monthsPt } from "utils/months.js";
import CurrentSummary from "components/sections/home/CurrentSummary.js";
import MonthTransactions from "components/sections/home/MonthTransactions.js";
import formatCurrency from "utils/formatCurrency";

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState();
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

  const verifyLastSelectedMonth = useCallback(() => {
    if (selectedMonth) {
      localStorage.setItem("lastSelectedMonth", JSON.stringify(selectedMonth));
    }
  }, [selectedMonth]);

  const getAvailableMonths = useCallback(async () => {
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
  }, []);

  const getMonthExpenses = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      `/api/v1/transaction/user/${userId}?month=${selectedMonth.number}&year=${selectedMonth.year}`,
    );
    const data = await response.json();
    if (data) setExpenses(data);
  }, [selectedMonth]);

  const getSummaries = useCallback(async () => {
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
  }, [selectedMonth]);

  const retrieveLastSelectedMonth = useCallback(async () => {
    if (!selectedMonth && months.length > 0) {
      const storedMonth = localStorage.getItem("lastSelectedMonth");
      if (storedMonth) {
        try {
          const parsed = JSON.parse(storedMonth);
          const match = months.find(
            (m) => m.number === parsed.number && m.year === parsed.year,
          );
          if (match) {
            setSelectedMonth(match);
            return;
          }
        } catch (e) {
          console.error("Erro ao restaurar mês do localStorage:", e);
        }
      }

      const currentMonthNumber = new Date().getMonth() + 1;
      const currentMonth = months.find(
        (m) =>
          m.number === currentMonthNumber &&
          m.year === new Date().getFullYear(),
      );

      setSelectedMonth(currentMonth ?? months[0]);
    }
  }, [months, selectedMonth]);

  useEffect(() => {
    verifyLastSelectedMonth();

    if (selectedMonth != undefined) {
      getMonthExpenses();
      getSummaries();
    }
  }, [selectedMonth, verifyLastSelectedMonth, getMonthExpenses, getSummaries]);

  useEffect(() => {
    getAvailableMonths();
  }, [getAvailableMonths]);

  useEffect(() => {
    retrieveLastSelectedMonth();
  }, [months, selectedMonth, retrieveLastSelectedMonth]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800">FINEVO</h1>
          <ActionButtons />
        </div>

        <CurrentSummary
          daily={dailyExpenses}
          weekly={weeklyExpenses}
          balance={currentBalanceMonth}
        />

        <div className="mt-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max whitespace-nowrap">
            {months.map((month) => (
              <button
                key={`${month.number}-${month.year}`}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedMonth != null &&
                  selectedMonth.number === month.number &&
                  selectedMonth.year === month.year
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>

        <MonthlySummary
          revenue={currentRevenue}
          expenses={currentExpenses}
          checkpoint={forecastCheckpoint}
          endOfMonth={forecastEndOfMonth}
        />

        {selectedMonth && (
          <MonthTransactions
            selectedMonth={selectedMonth}
            filteredExpenses={filteredExpenses}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token;
  const redirect = {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };

  if (!token) {
    return redirect;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user } };
  } catch (err) {
    return redirect;
  }
}
