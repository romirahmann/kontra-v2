"use client";

import dayjs from "dayjs";

export default function ArticlePreview({ article }) {
  const data = Array.isArray(article) ? article[0] : article;
  console.log(data);
  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-500">
        Memuat pratinjau artikel...
      </div>
    );
  }

  const latestVersion =
    Array.isArray(data.version) && data.version.length > 0
      ? data.version.reduce((latest, current) =>
          current.version > latest.version ? current : latest,
        )
      : null;

  return (
    <div className="lg:max-w-4xl max-w-3xl  mx-auto px-4 py-10">
      {data.status === "rejected" && (
        <>
          <div className=" border border-red-200 bg-red-200 px-4 py-2 rounded-2xl mb-12">
            <h1 className="font-bold uppercase text-lg"> Noted : </h1>
            <p>&quot; {data.rejected.note} &quot;</p>

            <div className="note mt-10 flex justify-between">
              <p className="text-sm">
                <span className="font-bold">Rejected By</span> :{" "}
                {data.rejected.fullName}
              </p>
              <p className="text-sm">
                <span className="font-bold">Rejected At :</span>
                {dayjs(data.rejected.created_at).format(
                  " ddd, DD MMM YYYY, HH:mm:ss",
                )}
              </p>
            </div>
          </div>
        </>
      )}
      {/* HEADER */}
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-bold leading-tight mb-4 text-gray-900">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>{data.author_name || "Admin"}</span>
          <span aria-hidden>•</span>
          <time dateTime={data.created_at}>
            {dayjs(data.created_at).format("DD MMM YYYY")}
          </time>
        </div>
      </header>

      {/* ================= EDITORIAL NOTE ================= */}
      {data.status === "rejected" && data.note && (
        <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <div className="text-red-500 text-lg leading-none">📝</div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-700">
                Catatan Redaksi
              </h3>

              <p className="mt-1 text-sm text-red-700 leading-relaxed italic">
                “{data.note}”
              </p>

              <div className="mt-2 text-xs text-red-500">
                {data.reviewer_name && <span>{data.reviewer_name}</span>}
                {data.rejected_at && (
                  <>
                    <span className="mx-1">•</span>
                    <time dateTime={data.rejected_at}>
                      {dayjs(data.rejected_at).format("DD MMM YYYY")}
                    </time>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <article
        className="
    prose prose-lg max-w-none
    prose-headings:scroll-mt-24

    prose-p:empty:block
    prose-p:empty:min-h-[1em]

    prose-img:rounded-xl
    prose-img:shadow-sm
    prose-table:rounded-lg
    prose-table:border
    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
  "
        dangerouslySetInnerHTML={{
          __html: latestVersion?.content_html || "",
        }}
      />
    </div>
  );
}
