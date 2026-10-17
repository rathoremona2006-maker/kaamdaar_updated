import React from 'react';
import './footer.css';

const Footer = () => {
  const footerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'App Introduction', href: '#appIntroduction' },
    { label: 'How It Works', href: '#howItWorks' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
    { label: 'Download App', href: '#download' },
  ];

  return (
    <footer className="footer-section">
      <div className="ft-water left-water" />
      <div className="ft-water right-water" />

      <div className="footer-top">
        <a href="#home" className="ft-logo">
          <div className="ft-logo-icon">K</div>

          <div className="ft-logo-text">
            <h3>KAAMDAAR</h3>
            <span>Har Kaam Turant</span>
          </div>
        </a>

        <nav className="ft-nav" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kaamdaar. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;