import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy | RBLC Ltd',
  description:
    'RBLC Ltd returns and refund policy for car spare parts in Rwanda. Learn about our commitment to quality and eligibility for returns within 7 days.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Returns & Refund Policy
          </h1>
          <p className="text-gray-600">Last updated: February 2025</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-primary-600 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At RBLC Ltd, we are committed to providing high-quality car spare
              parts to our customers across Rwanda. We stand behind the quality
              of our products and want you to be completely satisfied with
              your purchase. This Returns & Refund Policy explains the terms and
              conditions under which you may return products and receive a
              refund.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-primary-600 mb-4">
              2. Eligibility for Returns
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To be eligible for a return, your item must meet the following
              conditions:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold shrink-0">
                  •
                </span>
                <span>
                  <strong>Unused condition:</strong> The item must be unused and
                  in the same condition as when you received it. Parts that have
                  been installed, tested, or modified cannot be returned.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold shrink-0">
                  •
                </span>
                <span>
                  <strong>Original packaging:</strong> The item must be
                  returned in its original packaging. We require the original
                  packaging to ensure the part can be resold and to protect it
                  during transit.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold shrink-0">
                  •
                </span>
                <span>
                  <strong>7-day window:</strong> Returns must be initiated
                  within 7 days of delivery. Requests received after this period
                  will not be accepted.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold shrink-0">
                  •
                </span>
                <span>
                  <strong>Proof of purchase:</strong> You must provide valid
                  proof of purchase, such as your order confirmation, receipt,
                  or invoice.
                </span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 p-6 bg-primary-50 rounded-lg text-center">
          <p className="text-gray-700 mb-2">Need help with a return?</p>
          <Link
            href="/request"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Contact us →
          </Link>
        </div>
      </div>
    </div>
  );
}
