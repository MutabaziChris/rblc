'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { Phone, Mail } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '250786905080';
const PHONE = '+250 786 905 080';
const EMAIL = 'info@rblc.rw';

const socialLinks = [
  {
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com',
    icon: FaInstagram,
    label: 'Instagram',
    color: 'text-[#E4405F] hover:text-[#F77737]',
  },
  {
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com',
    icon: FaFacebookF,
    label: 'Facebook',
    color: 'text-[#1877F2] hover:text-[#0D65D9]',
  },
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: FaWhatsapp,
    label: 'WhatsApp',
    color: 'text-[#25D366] hover:text-[#20BD5A]',
  },
  {
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com',
    icon: FaLinkedin,
    label: 'LinkedIn',
    color: 'text-[#0A66C2] hover:text-[#004182]',
  },
];

export default function TopHeader() {
  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-end items-center gap-3 sm:gap-5 h-8 py-1.5 text-xs sm:text-sm">
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
          >
            <Mail size={13} className="shrink-0" />
            <span className="truncate">{EMAIL}</span>
          </a>
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
          >
            <Phone size={13} className="shrink-0" />
            <span>{PHONE}</span>
          </a>
          <span className="w-px h-4 bg-slate-600 shrink-0" aria-hidden />
          <nav className="flex items-center gap-2.5" aria-label="Social media">
            {socialLinks.map(({ href, icon: Icon, label, color }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex items-center justify-center w-6 h-6 transition-colors ${color}`}
              >
                <Icon size={15} />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
