import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackButton from "/components/buttons/BackButton";
import TransactionCard from "components/cards/TransactionCard.js";

export default function BillDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/v1/bills/transactions/${id}`)
      .then((res) => res.json())
      .then(setTransactions);
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-4 space-y-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Transações da Fatura</h1>
        {transactions
          .filter((tx) => tx)
          .map((tx) => (
            <TransactionCard key={tx.id} item={tx} />
          ))}
      </div>
    </div>
  );
}
