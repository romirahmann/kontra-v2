"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer({
  brand = "Awalan News",
  description = "Portal berita digital yang menyajikan informasi aktual, faktual, dan terpercaya.",
  categories = [],
  email = "redaksi@awalannews.com",
  address = "Jakarta, Indonesia",
  socials = {},
}) {
  return (
    <footer className="bg-black text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {brand}
            <span className="text-maroon-600">.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Category */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kategori</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((cat, index) => (
              <li key={index}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="hover:text-white transition"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex gap-4 text-lg">
            {socials.instagram && (
              <Link
                href={socials.instagram}
                target="_blank"
                className="hover:text-white transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </Link>
            )}
            {socials.tiktok && (
              <Link
                href={socials.tiktok}
                target="_blank"
                className="hover:text-white transition"
                aria-label="TikTok"
              >
                <FaTiktok />
              </Link>
            )}
            {socials.youtube && (
              <Link
                href={socials.youtube}
                target="_blank"
                className="hover:text-white transition"
                aria-label="YouTube"
              >
                <FaYoutube />
              </Link>
            )}
          </div>
        </div>

        {/* Contact & Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Informasi</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-maroon-600" />
              <a
                href={`mailto:${email}`}
                className="hover:text-white transition"
              >
                {email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-maroon-600" />
              <span>{address}</span>
            </li>
            <li>
              <Link href="/kebijakan-privasi" className="hover:text-white">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="/pedoman-media-siber" className="hover:text-white">
                Pedoman Media Siber
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {brand}. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
