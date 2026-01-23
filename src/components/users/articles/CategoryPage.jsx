import Link from "next/link";
import Image from "next/image";

const getThumbnail = (media) => {
  if (!Array.isArray(media)) return "/placeholder.jpg";
  return media.find((m) => m.type === "image")?.url || "/placeholder.jpg";
};

export default function CategoryPageUser({
  highlight = [],
  latest = [],
  trending = [],
  related = [],
  articles = [],
}) {
  if (!articles.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Belum ada artikel di kategori ini.
      </div>
    );
  }

  const categoryName = articles[0]?.category_name || "Kategori";
  const highlightArticle = highlight[0];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {categoryName}
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Berita terbaru seputar {categoryName.toLowerCase()}
        </p>
      </header>

      {/* 🔥 HIGHLIGHT */}
      {highlightArticle && (
        <section className="mb-14">
          <Link href={`/news/${highlightArticle.slug}`}>
            <article className="group grid md:grid-cols-2 gap-6 rounded-3xl overflow-hidden border bg-white hover:shadow-2xl transition">
              <div className="relative h-64 md:h-full">
                <Image
                  src={getThumbnail(highlightArticle.media)}
                  alt={highlightArticle.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-8 flex flex-col justify-center">
                <span className="mb-3 text-xs font-semibold text-maroon-600 uppercase tracking-widest">
                  🔥 Highlight
                </span>

                <h2 className="text-2xl md:text-3xl font-extrabold group-hover:text-maroon-600 transition">
                  {highlightArticle.title}
                </h2>

                <p className="mt-4 text-gray-600 line-clamp-4">
                  {highlightArticle.excerpt}
                </p>

                <div className="mt-5 text-xs text-gray-400">
                  {highlightArticle.author_name} •{" "}
                  {highlightArticle.category_name}
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* 🔥 TRENDING */}
      {trending.length > 0 && (
        <section className="mb-14">
          <h3 className="mb-6 text-xl font-bold flex gap-2">
            <span className="text-maroon-600">🔥</span> Trending
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group">
                <article className="rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition">
                  <div className="relative h-40">
                    <Image
                      src={getThumbnail(item.media)}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold line-clamp-3 group-hover:text-maroon-600">
                      {item.title}
                    </h4>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 📰 TERBARU */}
      {latest.length > 0 && (
        <section className="mb-16">
          <h3 className="mb-6 text-xl font-bold">Terbaru</h3>
          <ul className="divide-y">
            {latest.map((item) => (
              <li key={item.id} className="py-5">
                <Link href={`/news/${item.slug}`} className="flex gap-4 group">
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-maroon-600">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <span className="text-xs text-gray-400">
                      {item.author_name}
                    </span>
                  </div>

                  <div className="relative w-24 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={getThumbnail(item.media)}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🔗 RELATED */}
      {related.length > 0 && (
        <section>
          <h3 className="mb-6 text-xl font-bold border-b pb-3">
            Berita Terkait
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group">
                <article className="rounded-xl border p-4 hover:shadow-md transition">
                  <h5 className="font-medium group-hover:text-maroon-600">
                    {item.title}
                  </h5>
                  <span className="text-xs text-gray-400">
                    {item.category_name}
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
