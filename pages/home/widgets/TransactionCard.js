import { CreditCard } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

export default function TransactionCard({ item }) {
  const router = useRouter();
  const isRevenue = item.type_title === "revenue";
  const valueColor = isRevenue ? "text-green-600" : "text-red-600";
  const icon = isRevenue ? "↑" : "↓";

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

  function handleClick() {
    if (item.bill_title) {
      router.push(`/bills/${item.id}`);
    } else {
      router.push(`/transaction/expense?id=${item.id}`);
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex justify-between">
        {/* Coluna esquerda */}
        {item.bill_title ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <div className="font-medium text-gray-900">
                Fatura de {item.bill_title.split(" ")[0]}
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <span>{item.card_title}</span>
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: item.card_color }}
              ></span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-gray-900">{item.title}</div>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <span>{item.category_title}</span>
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: item.category_color }}
              ></span>
            </div>
          </div>
        )}

        {/* Coluna direita */}
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-xs text-gray-500">
            {formatDate(item.paid_at)}
          </div>
          <div
            className={`font-semibold ${valueColor} flex items-center gap-1`}
          >
            {item.card_color && !item.bill_title && (
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: item.card_color }}
                ></span>
              </div>
            )}
            {formatCurrency(item.value)}
            <span>{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
