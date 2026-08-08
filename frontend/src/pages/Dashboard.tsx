import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  LayoutGrid,
  Package,
  ShoppingBag,
  Users,
  Wallet,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Store,
} from "lucide-react";

type OrderStatus = "livree" | "en_cours" | "en_attente" | "annulee";

interface Order {
  id: string;
  client: string;
  vendeur: string;
  montant: number;
  statut: OrderStatus;
  date: string;
}

interface TopVendor {
  nom: string;
  ventes: number;
  part: number; // pourcentage
}

interface KpiStat {
  label: string;
  value: string;
  delta: number; // % variation, positif ou négatif
  icon: React.ReactNode;
}

interface RevenuePoint {
  mois: string;
  revenu: number;
  commandes: number;
}

// ----------------------------- Mock data -----------------------------------

const revenueData: RevenuePoint[] = [
  { mois: "Fév", revenu: 18200, commandes: 320 },
  { mois: "Mar", revenu: 21500, commandes: 365 },
  { mois: "Avr", revenu: 19800, commandes: 340 },
  { mois: "Mai", revenu: 24100, commandes: 402 },
  { mois: "Juin", revenu: 27600, commandes: 455 },
  { mois: "Juil", revenu: 26200, commandes: 431 },
  { mois: "Août", revenu: 31450, commandes: 512 },
];

const topVendors: TopVendor[] = [
  { nom: "Atelier Nomade", ventes: 8420, part: 27 },
  { nom: "Kolab Studio", ventes: 6310, part: 20 },
  { nom: "Terre & Bois", ventes: 4870, part: 16 },
  { nom: "Maison Verre", ventes: 3260, part: 11 },
];

const recentOrders: Order[] = [
  { id: "CMD-10482", client: "R. Andria", vendeur: "Atelier Nomade", montant: 128.5, statut: "livree", date: "07 Août" },
  { id: "CMD-10481", client: "L. Rakoto", vendeur: "Kolab Studio", montant: 64.0, statut: "en_cours", date: "07 Août" },
  { id: "CMD-10480", client: "H. Rasoa", vendeur: "Terre & Bois", montant: 212.9, statut: "en_attente", date: "06 Août" },
  { id: "CMD-10479", client: "M. Ravo", vendeur: "Maison Verre", montant: 45.2, statut: "livree", date: "06 Août" },
  { id: "CMD-10478", client: "T. Randria", vendeur: "Atelier Nomade", montant: 96.0, statut: "annulee", date: "05 Août" },
  { id: "CMD-10477", client: "S. Rabe", vendeur: "Kolab Studio", montant: 175.3, statut: "livree", date: "05 Août" },
];

const kpis: KpiStat[] = [
  { label: "Revenu du mois", value: "31 450 €", delta: 12.4, icon: <Wallet size={18} /> },
  { label: "Commandes", value: "512", delta: 8.1, icon: <ShoppingBag size={18} /> },
  { label: "Vendeurs actifs", value: "86", delta: -2.3, icon: <Store size={18} /> },
  { label: "Nouveaux clients", value: "204", delta: 15.7, icon: <Users size={18} /> },
];

// ----------------------------- Helpers -------------------------------------

const statusMeta: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  livree: { label: "Livrée", bg: "bg-[#E4EEE7]", text: "text-[#3E7A5C]" },
  en_cours: { label: "En cours", bg: "bg-[#E8D9BC]", text: "text-[#8A6420]" },
  en_attente: { label: "En attente", bg: "bg-[#EDEEE8]", text: "text-[#6E7568]" },
  annulee: { label: "Annulée", bg: "bg-[#F3E1DC]", text: "text-[#B3462F]" },
};

const StatusStamp: React.FC<{ statut: OrderStatus }> = ({ statut }) => {
  const meta = statusMeta[statut];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${meta.bg} ${meta.text}`}
    >
      {meta.label}
    </span>
  );
};

const navItems = [
  { label: "Aperçu", icon: <LayoutGrid size={18} />, active: true },
  { label: "Commandes", icon: <ShoppingBag size={18} />, active: false },
  { label: "Produits", icon: <Package size={18} />, active: false },
  { label: "Vendeurs", icon: <Store size={18} />, active: false },
  { label: "Clients", icon: <Users size={18} />, active: false },
];

// ----------------------------- Component ------------------------------------

const MarketplaceDashboard: React.FC = () => {
  const [range, setRange] = useState<"7j" | "30j" | "12m">("30j");

  const totalRevenue = useMemo(
    () => revenueData.reduce((sum, p) => sum + p.revenu, 0),
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#F4F5F1] font-sans text-[#16241F] flex">
      {/* ---------------------------- Sidebar ---------------------------- */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#DEDFD6] bg-white px-5 py-6">
        <div className="flex items-center gap-2 px-1 mb-8">
          <div className="h-8 w-8 rounded-md bg-[#16241F] flex items-center justify-center">
            <Store size={16} className="text-[#E8D9BC]" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Bazary
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-[#16241F] text-white"
                  : "text-[#4B5449] hover:bg-[#EDEEE8]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#DEDFD6]">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#4B5449] hover:bg-[#EDEEE8] w-full">
            <Settings size={18} />
            Paramètres
          </button>
        </div>
      </aside>

      {/* ---------------------------- Main -------------------------------- */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-[#DEDFD6] bg-white px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold">Aperçu marketplace</h1>
            <p className="text-sm text-[#6E7568]">Vendredi 7 août — synthèse quotidienne</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#DEDFD6] bg-[#F4F5F1] px-3 py-2 text-sm text-[#6E7568]">
              <Search size={15} />
              <span>Rechercher…</span>
            </div>
            <button className="relative rounded-full p-2 hover:bg-[#EDEEE8]">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B3462F]" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-[#DEDFD6]">
              <div className="h-8 w-8 rounded-full bg-[#E8D9BC] flex items-center justify-center font-display text-sm font-semibold text-[#8A6420]">
                A
              </div>
              <ChevronDown size={14} className="text-[#6E7568]" />
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-[#DEDFD6] bg-white p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F5F1] text-[#16241F]">
                    {kpi.icon}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      kpi.delta >= 0 ? "text-[#3E7A5C]" : "text-[#B3462F]"
                    }`}
                  >
                    {kpi.delta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(kpi.delta)}%
                  </span>
                </div>
                <p className="font-display text-2xl font-semibold tabular-nums">
                  {kpi.value}
                </p>
                <p className="text-xs text-[#6E7568] mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Chart + Top vendors */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-[#DEDFD6] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-[#6E7568]">Revenu cumulé (7 mois)</p>
                  <p className="font-display text-2xl font-semibold tabular-nums">
                    {totalRevenue.toLocaleString("fr-FR")} €
                  </p>
                </div>
                <div className="flex rounded-full border border-[#DEDFD6] p-0.5 text-xs">
                  {(["7j", "30j", "12m"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-3 py-1.5 rounded-full transition-colors ${
                        range === r ? "bg-[#16241F] text-white" : "text-[#6E7568]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B8863E" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#B8863E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDEEE8" vertical={false} />
                    <XAxis
                      dataKey="mois"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6E7568", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6E7568", fontSize: 12 }}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #DEDFD6",
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`, "Revenu"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenu"
                      stroke="#B8863E"
                      strokeWidth={2}
                      fill="url(#revenueFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-[#DEDFD6] bg-white p-5">
              <p className="text-sm text-[#6E7568] mb-4">Meilleurs vendeurs</p>
              <div className="space-y-4">
                {topVendors.map((v) => (
                  <div key={v.nom}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="font-medium">{v.nom}</span>
                      <span className="font-mono text-xs text-[#6E7568]">
                        {v.ventes.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#EDEEE8]">
                      <div
                        className="h-1.5 rounded-full bg-[#B8863E]"
                        style={{ width: `${v.part}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent orders table */}
          <div className="rounded-xl border border-[#DEDFD6] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#DEDFD6]">
              <p className="font-display text-base font-semibold">Commandes récentes</p>
              <button className="text-sm text-[#B8863E] font-medium hover:underline">
                Voir tout
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-[#6E7568] border-b border-[#DEDFD6]">
                    <th className="px-5 py-3 font-medium">Commande</th>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Vendeur</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 font-medium text-right">Montant</th>
                    <th className="px-5 py-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={`border-b border-[#EDEEE8] last:border-0 ${
                        i % 2 === 1 ? "bg-[#F9F9F7]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-[#6E7568]">{order.id}</td>
                      <td className="px-5 py-3">{order.client}</td>
                      <td className="px-5 py-3 text-[#4B5449]">{order.vendeur}</td>
                      <td className="px-5 py-3">
                        <StatusStamp statut={order.statut} />
                      </td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums">
                        {order.montant.toFixed(2)} €
                      </td>
                      <td className="px-5 py-3 text-right text-[#6E7568]">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketplaceDashboard;