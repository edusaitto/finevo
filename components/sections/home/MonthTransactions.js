import TransactionCard from "components/cards/TransactionCard.js";

export default function MonthTransactions({
  selectedMonth,
  filteredExpenses,
  filterType,
  setFilterType,
}) {
  return (
    <section className="bg-white rounded-xl shadow p-4 mt-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Transações de {selectedMonth.label.toLowerCase()}
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

      <div className="overflow-x-auto w-full">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredExpenses.map((item, index) => (
            <TransactionCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
