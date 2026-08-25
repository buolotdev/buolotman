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
          margin: 40px auto 150px;
          padding: 0 24px;
        }
        
        .hiw-hero {
          background: linear-gradient(135deg, #001F3F, #0b3c6f);
          color: #fff;
          padding: 85px 65px;
          border-radius: 36px;
          box-shadow: 0 20px 50px rgba(0, 31, 63, 0.15);
        }
        
        .hiw-hero h1 {
          margin: 0;
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
        }
        
        .hiw-hero p {
          margin-top: 18px;
          font-size: 18px;
          max-width: 1150px;
          opacity: 0.95;
          line-height: 1.6;
        }
        
        .hiw-anchor-menu {
          background: #fff;
          border-radius: 28px;
          margin-top: -36px;
          padding: 20px 30px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          position: relative;
          z-index: 10;
          border: 1px solid #e2e8f0;
        }
        
        .hiw-anchor-menu a {
          background: #f1f5f9;
          padding: 10px 20px;
          border-radius: 999px;
          color: #001F3F;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        
        .hiw-anchor-menu a:hover {
          background: #FF4500;
          color: #fff;
          transform: translateY(-2px);
        }
        
        .hiw-section {
          margin-top: 90px;
        }
        
        .hiw-section h2 {
          font-size: 34px;
          color: #001F3F;
          margin-bottom: 20px;
          font-weight: 800;
        }
        
        .hiw-card {
          background: #0F2C4A;
          color: #fff;
          border-radius: 28px;
          padding: 38px 32px;
          margin-top: 28px;
          box-shadow: 0 20px 50px rgba(0, 31, 63, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .hiw-card h3 {
          font-size: 24px;
          color: #FF4500;
          margin-top: 0;
          margin-bottom: 16px;
          font-weight: 800;
        }
        
        .hiw-card p {
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.8;
          font-size: 15.5px;
        }
        
        .hiw-card ul {
          padding-left: 20px;
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .hiw-card li {
          margin-bottom: 10px;
          font-size: 15px;
          line-height: 1.5;
        }
        
        .hiw-card a {
          color: #ff7b47;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
          transition: color 0.2s;
        }
        
        .hiw-card a:hover {
          color: #ff9d75;
          text-decoration: underline;
        }
        
        .hiw-divider {
          margin-top: 80px;
          border-top: 2px dashed #cbd6e2;
          padding-top: 80px;
        }
        
        @media (max-width: 768px) {
          .hiw-container {
            margin: 20px auto 70px;
            padding: 0 16px;
          }
          .hiw-hero {
            padding: 36px 20px;
            border-radius: 22px;
          }
          .hiw-hero h1 {
            font-size: 26px;
            line-height: 1.25;
          }
          .hiw-hero p {
            font-size: 14.5px;
            margin-top: 12px;
            line-height: 1.5;
          }
          .hiw-anchor-menu {
            margin-top: -24px;
            padding: 12px;
            border-radius: 18px;
            gap: 8px;
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .hiw-anchor-menu::-webkit-scrollbar {
            display: none;
          }
          .hiw-anchor-menu a {
            padding: 8px 14px;
            font-size: 13px;
            flex-shrink: 0;
          }
          .hiw-section {
            margin-top: 48px;
          }
          .hiw-section h2 {
            font-size: 22px;
            margin-bottom: 12px;
          }
          .hiw-card {
            padding: 24px 18px;
            border-radius: 20px;
            margin-top: 18px;
          }
          .hiw-card h3 {
            font-size: 19px;
            margin-bottom: 12px;
          }
          .hiw-card p {
            font-size: 14px;
          }
          .hiw-card li {
            font-size: 13.5px;
          }
          .hiw-divider {
            margin-top: 48px;
            padding-top: 48px;
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
