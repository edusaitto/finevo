import Card from "components/cards/BasicCard.js";

export default function CurrentSummary({ daily, weekly, balance }) {
  if (daily === null) {
    return (
      <div className="flex align-center justify-center mt-5 pt-5">
        <h3 className="text-lg font-semibold text-gray-500">
          Você ainda não adicionou nenhuma transação
        </h3>
      </div>
    );
  }

  if (daily == undefined) {
    return (
      <div className="animate-pulse">
        <div className="h-[128px] bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumo Atual</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Gastos do Dia" value={daily} />
        <Card title="Gastos da Semana" value={weekly} />
        <Card title="Saldo Atual" value={balance} />
      </div>
    </section>
  );
}
