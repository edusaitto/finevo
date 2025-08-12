import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function ActionButtons() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2">
      {/* Menu mobile (visível só em <sm) */}
      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-xl shadow hover:bg-cyan-700 transition w-full"
        >
          <Menu size={20} />
        </button>

        {menuOpen && (
          <div className="flex flex-col gap-2 p-2 bg-white rounded-xl shadow-lg w-40 absolute right-6">
            {/* <Link href="/cards">
              <button className="w-full bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition text-sm text-left">
                Novo cartão
              </button>
            </Link>
            <Link href="/category">
              <button className="w-full bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition text-sm text-left">
                Nova categoria
              </button>
            </Link> */}
            <Link href="/transaction/revenue">
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition text-sm text-left">
                Nova receita
              </button>
            </Link>
            <Link href="/transaction/expense">
              <button className="w-full bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition text-sm text-left">
                Nova despesa
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="hidden sm:flex gap-2">
        {/* <Link href="/cards">
          <button className="bg-cyan-600 text-white px-4 py-2 rounded-xl shadow hover:bg-cyan-700 transition">
            Novo cartão
          </button>
        </Link>
        <Link href="/category">
          <button className="bg-cyan-600 text-white px-4 py-2 rounded-xl shadow hover:bg-cyan-700 transition">
            Nova categoria
          </button>
        </Link> */}
        <Link href="/transaction/revenue">
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition">
            Nova receita
          </button>
        </Link>
        <Link href="/transaction/expense">
          <button className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition">
            Nova despesa
          </button>
        </Link>
      </div>
    </div>
  );
}
