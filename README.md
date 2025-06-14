# 🎓 Blockchain Credential Verification System

> Built during the NMKR & Cardano Hackathon 2024

---

## 🚀 Problem Statement

In today's education systems, official credentials like diplomas, transcripts, and enrollment confirmations are often issued as physical paper or unsecured PDFs. These documents:

- ✅ Can be easily forged or altered
- ✅ Are inconvenient for cross-border verification
- ✅ Require manual bureaucratic processes to validate
- ✅ Often get lost or misplaced

---

## 💡 Our Solution

We developed a **blockchain-based credential verification platform** where universities and institutions issue official documents as NFTs (Non-Fungible Tokens) on the Cardano blockchain.

- **Decentralized** — Credentials live on-chain, fully owned by students.
- **Tamper-proof** — Once issued, records cannot be altered or forged.
- **Easily Verifiable** — Employers, embassies, or third parties can verify credentials instantly.
- **Interoperable** — The platform can easily scale beyond universities to other industries.

---

## 🔧 Key Features

- ✅ NFT minting for diplomas, enrollment certificates, transcripts, etc.
- ✅ Fully owned by the student in their personal Cardano wallet
- ✅ Public verification interface for employers & institutions
- ✅ Issuer-controlled minting authority (universities hold issuer keys)
- ✅ Simplified integration with existing university platforms (e.g. HISinOne)
- ✅ Expandable architecture to support:
  - Professional certifications
  - Government-issued documents
  - Medical licenses
  - Employment verification
  - Volunteer service certificates

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | Cardano |
| NFT Minting | NMKR API |
| Wallets | NMKR Wallet, Nami, Eternl |
| Frontend | React (Vite) |
| Backend | Node.js |
| File Storage | IPFS (optional for storing diploma PDFs) |
| Deployment | Vercel / Netlify (frontend), Railway / Render (backend) |

---

## 🔄 Project Structure

/client - React frontend (minting, verification UI)
/server - Node.js backend (NMKR API integration, minting logic)
/. env - Environment variables (API keys, wallet IDs)
/docs - (Optional) Documentation files, metadata schemas

---



---

## 🖥 Demo Flow

### 🎓 University Admin

- Accesses admin panel
- Inputs student name, degree, graduation date, student wallet address
- Mints credential NFT using NMKR API

### 👩‍🎓 Student

- Receives credential NFT in their Cardano wallet
- Fully owns the credential on-chain

### 🏢 Employer / Verifier

- Receives verification link or QR code from student
- Opens verification interface to instantly check:
  - ✅ Issuer
  - ✅ Student Name
  - ✅ Degree Info
  - ✅ Authenticity on-chain

---

## 🧭 Hackathon Highlights

- 🔐 Fully decentralized credential verification system
- 🌍 Designed for global, cross-border education & employment scenarios
- ⚙️ Fully functional MVP built in < 24h
- 🏛 Easily extendable for real institutional use

---

## 🔮 Future Roadmap

- ✅ On-chain verification fully integrated via Blockfrost or NMKR Explorer
- ✅ Direct integration with university platforms (HISinOne, SAP Student)
- ✅ Privacy Layer: Encrypt sensitive data using Midnight (Cardano Privacy Sidechain)
- ✅ Support multiple credential issuers beyond education
- ✅ Mobile wallet integration for better student experience
- ✅ QR-code based instant verification system

---

## 📄 License

MIT License — feel free to fork, extend, and contribute!

---

## 🤝 Special Thanks

- NMKR Team 🚀  
- Cardano Developer Community ❤️  
- Hackathon Organizers 🎯  
- Mentors & Judges 🏆

---

# 🏁 TL;DR

> We don't just solve diploma fraud — we give ownership of credentials back to students, reduce administrative friction for universities, and offer instant verifiability to employers — all powered by Cardano.



