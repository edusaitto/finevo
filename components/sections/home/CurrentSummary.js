import Card from "components/cards/BasicCard.js";

export default function CurrentSummary({ daily, weekly, balance }) {
  const _daily = daily || "R$ --";
  const _weekly = weekly || "R$ --";
  const _balance = balance || "R$ --";

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumo Atual</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Gastos do Dia" value={_daily} />
        <Card title="Gastos da Semana" value={_weekly} />
        <Card title="Saldo Atual" value={_balance} />
      </div>
    </section>
  );
}
