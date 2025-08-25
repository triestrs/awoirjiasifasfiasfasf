import Link from "next/link";

export default function Home() {
  const products = [
    { id: 1, name: "100 Sheckels", price: 10000 },
    { id: 2, name: "500 Sheckels", price: 45000 },
    { id: 3, name: "1000 Sheckels", price: 85000 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Arins Market</h1>
          <p className="text-sm text-gray-600">Top up Sheckels cepat & aman</p>
        </div>
        <nav>
          <a href="#products" className="px-4">Produk</a>
        </nav>
      </header>

      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <p className="text-gray-700 mb-4">Rp {p.price.toLocaleString("id-ID")}</p>
            <Link
              href={{
                pathname: "/checkout",
                query: { product: p.name, price: p.price },
              }}
            >
              <a className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Beli Sekarang</a>
            </Link>
          </div>
        ))}
      </section>

      <footer className="w-full max-w-5xl mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Arins Market
      </footer>
    </div>
  );
}
