"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function HowItWorksPage() {
  return (
    <div id="how-it-works-screen">
      <Header />

      <style dangerouslySetInnerHTML={{ __html: `
        .hiw-container {
          max-width: 1450px;
          margin: 40px auto 180px;
          padding: 0 24px;
        }
        
        .hiw-hero {
          background: #001F3F;
          color: #fff;
          padding: 95px 70px;
          border-radius: 42px;
        }
        
        .hiw-hero h1 {
          margin: 0;
          font-size: 52px;
        }
        
        .hiw-hero p {
          margin-top: 18px;
          font-size: 19px;
          max-width: 1150px;
          opacity: 0.96;
        }
        
        .hiw-anchor-menu {
          background: #fff;
          border-radius: 28px;
          margin-top: -40px;
          padding: 26px 34px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          justify-content: center;
          position: relative;
          z-index: 10;
        }
        
        .hiw-anchor-menu a {
          background: #f2f6fb;
          padding: 12px 22px;
          border-radius: 999px;
          color: #001F3F;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .hiw-anchor-menu a:hover {
          background: #FF4500;
          color: #fff;
        }
        
        .hiw-section {
          margin-top: 120px;
        }
        
        .hiw-section h2 {
          font-size: 42px;
          color: #001F3F;
          margin-bottom: 22px;
        }
        
        .hiw-card {
          background: #0F2C4A;
          color: #fff;
          border-radius: 34px;
          padding: 44px;
          margin-top: 34px;
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .hiw-card h3 {
          font-size: 28px;
          color: #FF4500;
          margin-top: 0;
          margin-bottom: 20px;
        }
        
        .hiw-card p {
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.9;
          font-size: 16px;
        }
        
        .hiw-card ul {
          padding-left: 22px;
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .hiw-card li {
          margin-bottom: 12px;
          font-size: 16px;
        }
        
        .hiw-card a {
          color: #FF4500;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
        }
        
        .hiw-card a:hover {
          text-decoration: underline;
        }
        
        .hiw-divider {
          margin-top: 120px;
          border-top: 2px dashed #cbd6e2;
          padding-top: 120px;
        }
        
        @media (max-width: 768px) {
          .hiw-hero {
            padding: 50px 30px;
          }
          .hiw-hero h1 {
            font-size: 36px;
          }
          .hiw-anchor-menu {
            padding: 20px;
          }
          .hiw-card {
            padding: 30px;
          }
        }
      `}} />

      <div className="hiw-container">
        {/* HERO */}
        <div className="hiw-hero">
          <h1>How Boulot Man Works</h1>
          <p>
            Boulot Man connects clients with verified technicians, engineers, freelancers, 
            and companies across Africa — making it easy to find, manage, and pay for trusted services.
          </p>
        </div>

        {/* ANCHOR MENU */}
        <div className="hiw-anchor-menu">
          <a href="#clients">Clients</a>
          <a href="#post-task">Post a Task</a>
          <a href="#find-services">Find Technicians & Companies</a>
          <a href="#payments">Payments & Escrow</a>
          <a href="#disputes">Disputes</a>
          <a href="#technicians">Technicians</a>
          <a href="#companies">Companies</a>
        </div>

        {/* CLIENTS */}
        <div id="clients" className="hiw-section">
          <h2>For Clients</h2>

          <div id="post-task" className="hiw-card">
            <h3>How to Post a Task</h3>
            <p>
              Posting a task allows you to receive multiple offers from qualified technicians
              or companies and choose the best option.
            </p>
            <ul>
              <li>Log in to your Boulot Man account</li>
              <li>Click <strong>Post a Task</strong></li>
              <li>Select the service category</li>
              <li>Describe your task clearly</li>
              <li>Set location, schedule, urgency, and budget</li>
              <li>Preview, edit, save as draft, or publish</li>
            </ul>
            <p><Link href="/post-task">Go to Post a Task →</Link></p>
          </div>

          <div id="find-services" className="hiw-card">
            <h3>Finding Technicians & Companies</h3>
            <p>
              You can either post a task or directly browse verified technicians and companies.
            </p>
            <ul>
              <li>Browse by category, location, or rating</li>
              <li>View verified profiles and portfolios</li>
              <li>Check experience and completed jobs</li>
            </ul>
            <p>
              <Link href="/technicians">Browse Technicians →</Link><br/>
              <Link href="/companies">Browse Companies →</Link>
            </p>
          </div>

          <div className="hiw-card">
            <h3>Comparing Offers & Profiles</h3>
            <ul>
              <li>Compare prices from multiple providers</li>
              <li>Check ratings & reviews</li>
              <li>Review experience and certifications</li>
              <li>Ask questions before confirming</li>
            </ul>
          </div>

          <div id="payments" className="hiw-card">
            <h3>Understanding Payments & Escrow</h3>
            <p>
              Boulot Man uses <strong>BPay Wallet & Escrow</strong> to protect both clients and service providers.
            </p>
            <ul>
              <li>Pay via Mobile Money, Card, or Bank</li>
              <li>Funds can be held securely in escrow</li>
              <li>Payment is released only after approval</li>
            </ul>
            <p><Link href="#">Learn about Payments & Escrow →</Link></p>
          </div>

          <div id="disputes" className="hiw-card">
            <h3>Reporting Issues or Disputes</h3>
            <ul>
              <li>Raise disputes directly from your dashboard</li>
              <li>Submit evidence (photos, messages, reports)</li>
              <li>Boulot Man mediates fairly</li>
            </ul>
            <p><Link href="#">Dispute Resolution →</Link></p>
          </div>
        </div>

        {/* TECHNICIANS */}
        <div id="technicians" className="hiw-section hiw-divider">
          <h2>For Technicians & Free Agents</h2>

          <div className="hiw-card">
            <h3>Creating a Technician Profile</h3>
            <ul>
              <li>Register as a technician or free agent</li>
              <li>Add skills, experience, and services</li>
              <li>Upload certificates and portfolio</li>
              <li>Complete verification</li>
            </ul>
            <p><Link href="/signup">Create Technician Profile →</Link></p>
          </div>

          <div className="hiw-card">
            <h3>Posting Your Services</h3>
            <ul>
              <li>Create service listings</li>
              <li>Select categories and pricing</li>
              <li>Choose onsite or remote services</li>
            </ul>
          </div>

          <div className="hiw-card">
            <h3>Finding & Bidding on Tasks</h3>
            <ul>
              <li>Browse posted tasks</li>
              <li>Bid with price and message</li>
              <li>Negotiate and accept jobs</li>
            </ul>
          </div>

          <div className="hiw-card">
            <h3>Receiving Payments & Withdrawals</h3>
            <ul>
              <li>Get paid through BPay Wallet</li>
              <li>Escrow-secured payments</li>
              <li>Withdraw to bank or mobile money</li>
            </ul>
          </div>

          <div className="hiw-card">
            <h3>Verification & Certification</h3>
            <ul>
              <li>ID and skill verification</li>
              <li>Optional certifications</li>
              <li>Tier upgrades (Basic → Pro)</li>
            </ul>
            <p><Link href="#">View Tier Levels →</Link></p>
          </div>
        </div>

        {/* COMPANIES */}
        <div id="companies" className="hiw-section hiw-divider">
          <h2>For Companies</h2>

          <div className="hiw-card">
            <h3>Registering a Company</h3>
            <ul>
              <li>Create a company account</li>
              <li>Submit licenses & documents</li>
              <li>Get verified by Boulot Man</li>
            </ul>
            <p><Link href="/signup">Register Company →</Link></p>
          </div>

          <div className="hiw-card">
            <h3>Posting Company Services</h3>
            <ul>
              <li>List company services</li>
              <li>Showcase portfolio & past projects</li>
              <li>Receive corporate job requests</li>
            </ul>
          </div>

          <div className="hiw-card">
            <h3>Managing Company Profiles</h3>
            <ul>
              <li>Update company info</li>
              <li>Manage staff and services</li>
              <li>Track ratings and performance</li>
            </ul>
          </div>

          <div className="hiw-card">
            <h3>Contracts & Long-Term Projects</h3>
            <ul>
              <li>Access Build-a-Team services</li>
              <li>Use escrow for large contracts</li>
              <li>Project management & reporting</li>
            </ul>
          </div>

          <div className="hiw-card">
            <h3>Compliance & Verification</h3>
            <ul>
              <li>License validation</li>
              <li>Safety and quality standards</li>
              <li>Enterprise-level compliance</li>
            </ul>
            <p><Link href="#">Enterprise Services →</Link></p>
          </div>
        </div>

      </div>
    </div>
  );
}
