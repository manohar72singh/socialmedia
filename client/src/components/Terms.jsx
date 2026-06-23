import React from 'react';

export default function Terms() {
  return (
    <section className="py-12 sm:py-16 bg-[#0F172A]">
      <div className="container mx-auto px-5 sm:px-6 max-w-4xl text-slate-300">
        <div className="bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Terms of Service</h2>
          <p className="mb-6">
            Welcome to Tech Digi. By accessing our website, you agree to these terms and conditions. Please read them carefully.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Use of Services</h3>
          <p className="mb-4">
            Our digital marketing services, including SEO, PPC, and Web Design, are provided "as is". Tech Digi reserves the right to modify or discontinue any service at any time without notice.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Intellectual Property</h3>
          <p className="mb-4">
            All content on this website, including text, graphics, logos, and software, is the property of Tech Digi and is protected by international copyright laws.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Limitation of Liability</h3>
          <p className="mb-4">
            Tech Digi shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Governing Law</h3>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Tech Digi is registered, without regard to its conflict of law provisions.
          </p>

          <p className="mt-10 text-sm text-slate-500">Last Updated: June 12, 2026</p>
        </div>
      </div>
    </section>
  );
}
