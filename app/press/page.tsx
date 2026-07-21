"use client";

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PressPage() {
  return (
    <div id="press-screen">
      <Header />

      <style dangerouslySetInnerHTML={{ __html: `
        .press-hero {
          padding: 90px 60px;
          background: linear-gradient(135deg, #001F3F, #003366);
          color: #fff;
          text-align: center;
        }
        .press-hero h2 {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .press-hero p {
          max-width: 900px;
          margin: 0 auto 30px;
          font-size: 1.15rem;
        }
        .press-hero .press-meta {
          font-size: 0.9rem;
          color: #cfe0f1;
        }
        
        .press-section {
          padding: 80px 60px;
        }
        .press-section-title {
          text-align: center;
          margin-bottom: 60px;
        }
        .press-section-title h3 {
          font-size: 2.4rem;
          color: #001F3F;
        }
        .press-section-title p {
          max-width: 900px;
          margin: 14px auto 0;
          color: #555;
          font-size: 1.05rem;
        }
        
        .press-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .press-card {
          background: #0F2C4A;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .press-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .press-content {
          padding: 22px;
        }
        .press-content span {
          display: inline-block;
          font-size: 0.8rem;
          color: #FF4500;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .press-content h4 {
          color: #fff;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .press-content p {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 16px;
        }
        .press-content a {
          color: #FF4500;
          font-weight: 600;
          text-decoration: none;
        }
        .press-content a:hover {
          text-decoration: underline;
        }
        
        .media-kit {
          background: #001F3F;
        }
        .media-kit .press-section-title h3 {
          color: #fff;
        }
        .media-kit .press-section-title p {
          color: rgba(255, 255, 255, 0.85);
        }
        .kit-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .kit-card {
          background: #0F2C4A;
          border-radius: 16px;
          padding: 26px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .kit-card h4 {
          color: #fff;
          margin-bottom: 10px;
        }
        .kit-card p {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 14px;
        }
        .kit-card a {
          display: inline-block;
          padding: 8px 16px;
          border: 1px solid #FF4500;
          border-radius: 6px;
          text-decoration: none;
          color: #FF4500;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        .kit-card a:hover {
          background: #FF4500;
          color: #fff;
        }
        
        .press-facts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          text-align: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        .press-fact strong {
          display: block;
          font-size: 2rem;
          color: #001F3F;
        }
        .press-fact span {
          font-size: 0.9rem;
          color: #555;
        }
        
        .press-contact {
          background: linear-gradient(135deg, #001F3F, #002b55);
          color: #fff;
          text-align: center;
          padding: 90px 60px;
        }
        .press-contact h3 {
          font-size: 2.4rem;
          margin-bottom: 18px;
        }
        .press-contact p {
          max-width: 800px;
          margin: 0 auto 30px;
          font-size: 1.1rem;
        }
        .press-contact a {
          background: #FF4500;
          color: #fff;
          padding: 14px 34px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1rem;
          display: inline-block;
          font-weight: 600;
          transition: background 0.2s ease;
        }
        .press-contact a:hover {
          background: #e63e00;
        }
        
        @media (max-width: 1100px) {
          .press-grid, .kit-grid, .press-facts {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 700px) {
          .press-section {
            padding: 60px 30px;
          }
          .press-hero {
            padding: 60px 30px;
          }
          .press-grid, .kit-grid, .press-facts {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      <section className="press-hero">
        <h2>Press & Media</h2>
        <p>Latest news, announcements, and media resources from Boulot Man. We welcome journalists, bloggers, and media partners.</p>
        <div className="press-meta">For press inquiries: press@boulotman.com</div>
      </section>

      <section className="press-section">
        <div className="press-section-title">
          <h3>Latest News</h3>
          <p>Official announcements and coverage from Boulot Man.</p>
        </div>
        <div className="press-grid">
          <div className="press-card">
            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" alt="Press Release" />
            <div className="press-content">
              <span>Press Release</span>
              <h4>Boulot Man Launches Across New African Markets</h4>
              <p>The platform expands operations to new regions, empowering more technicians and businesses.</p>
              <Link href="#">Read more →</Link>
            </div>
          </div>
          <div className="press-card">
            <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg" alt="Media Coverage" />
            <div className="press-content">
              <span>Media Coverage</span>
              <h4>How Boulot Man Is Reshaping the African Workforce</h4>
              <p>Industry leaders discuss the impact of verified digital labor platforms.</p>
              <Link href="#">Read more →</Link>
            </div>
          </div>
          <div className="press-card">
            <img src="https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg" alt="Announcement" />
            <div className="press-content">
              <span>Announcement</span>
              <h4>Introducing Secure Escrow Payments for All Projects</h4>
              <p>Ensuring trust, transparency, and accountability across the platform.</p>
              <Link href="#">Read more →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="press-section media-kit">
        <div className="press-section-title">
          <h3>Media Kit</h3>
          <p>Download official Boulot Man assets and brand resources.</p>
        </div>
        <div className="kit-grid">
          <div className="kit-card">
            <h4>Brand Logos</h4>
            <p>Official logos in multiple formats.</p>
            <Link href="#">Download</Link>
          </div>
          <div className="kit-card">
            <h4>Brand Guidelines</h4>
            <p>Usage rules, colors, and typography.</p>
            <Link href="#">Download</Link>
          </div>
          <div className="kit-card">
            <h4>Product Screenshots</h4>
            <p>High-resolution platform images.</p>
            <Link href="#">Download</Link>
          </div>
          <div className="kit-card">
            <h4>Company Fact Sheet</h4>
            <p>Quick overview of Boulot Man.</p>
            <Link href="#">Download</Link>
          </div>
        </div>
      </section>

      <section className="press-section">
        <div className="press-section-title">
          <h3>Boulot Man at a Glance</h3>
          <p>Key facts for journalists and partners.</p>
        </div>
        <div className="press-facts">
          <div className="press-fact"><strong>50,000+</strong><span>Tasks Completed</span></div>
          <div className="press-fact"><strong>12,000+</strong><span>Verified Professionals</span></div>
          <div className="press-fact"><strong>8+</strong><span>Countries Served</span></div>
          <div className="press-fact"><strong>4.8/5</strong><span>Average Rating</span></div>
        </div>
      </section>

      <section className="press-contact">
        <h3>Media Inquiries</h3>
        <p>For interviews, press materials, or speaking opportunities, contact our media team.</p>
        <a href="mailto:press@boulotman.com">Contact Press Team</a>
      </section>

      <Footer />
    </div>
  );
}
