import Card from "components/cards/BasicCard.js";

export default function MonthlySummary({
  revenue,
  expenses,
  checkpoint,
  endOfMonth,
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Resumo Mensal
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Entradas" value={revenue} />
        <Card title="Saídas" value={expenses} />
        <Card title="Checkpoint (Dia 14)" value={checkpoint} />
        <Card title="Fim do Mês" value={endOfMonth} />
      </div>
    </section>
  );
}
