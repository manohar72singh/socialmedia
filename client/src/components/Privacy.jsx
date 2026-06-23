import React from 'react';

export default function Privacy() {
  return (
    <section className="py-12 sm:py-16 bg-[#0F172A]">
      <div className="container mx-auto px-5 sm:px-6 max-w-4xl text-slate-300">
        <div className="bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Privacy Policy</h2>
          <p className="mb-6">
            At Tech Digi, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h3>
          <p className="mb-4">
            We may collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, or when contacting us through our leads form.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h3>
          <p className="mb-4">
            We use personal information collected via our website for a variety of business purposes, including to provide services, respond to inquiries, and send administrative information to you.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Cookies and Tracking</h3>
          <p className="mb-4">
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information to improve your user experience and for our own analytics.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Data Security</h3>
          <p className="mb-4">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          </p>

          <p className="mt-10 text-sm text-slate-500">Last Updated: June 12, 2026</p>
        </div>
      </div>
    </section>
  );
}
