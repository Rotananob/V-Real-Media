import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center font-khmer">
      <div className="max-w-md w-full">
        <span className="text-xs font-mono text-accent-red font-semibold tracking-wider uppercase block mb-3">
          404 // FRAME NOT FOUND
        </span>

        <h1 className="text-7xl sm:text-8xl font-display font-extrabold text-neutral-900 tracking-tighter mb-3">
          404
        </h1>

        <h2 className="text-lg font-bold text-neutral-800 mb-2">
          រកមិនឃើញទំព័រនេះឡើយ
        </h2>

        <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
          ទំព័រ ឬវីដេអូដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬមិនមាននៅក្នុងប្រព័ន្ធឡើយ។
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>ត្រឡប់ទៅទំព័រដើម</span>
        </Link>
      </div>
    </div>
  );
}
