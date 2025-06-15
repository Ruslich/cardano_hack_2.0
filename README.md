# 🎓 Blockchain Credential Verification System

> Built during the NMKR & Cardano Hackathon 2025

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

## 📁 Project Structure

```
cardano_hack_2.0/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── public/              # Static files
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Node.js backend
│   ├── api/                 # API routes and controllers
│   │   └── nft/            # NFT minting service
│   │       ├── mint_nft.py # NFT minting logic
│   │       └── templates/  # HTML templates
│   ├── db/                 # Database migrations and models
│   └── package.json        # Backend dependencies
│
└── docker-compose.yml      # Docker orchestration
```

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.9+
- Docker and Docker Compose
- MySQL (if running without Docker)

### Environment Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd cardano_hack_2.0
```

2. Set up environment variables:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:4000

# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cardano_hack
```

### Running with Docker (Recommended)
1. Build and start all services:
```bash
docker-compose up --build
```

This will start:
- Frontend on http://localhost:3000
- Node.js backend on http://localhost:4000
- Python NFT service on http://localhost:8001
- MySQL database on localhost:3306

### Running without Docker
1. Frontend:
```bash
cd frontend
npm install
npm start
```

2. Node.js Backend:
```bash
cd backend
npm install
node index.js
```

3. Python NFT Service:
```bash
cd backend/api/nft
pip install -r requirements.txt
uvicorn mint_nft:app --reload --port 8001
```

4. MySQL:
- Install and start MySQL
- Create database: `cardano_hack`
- Run migrations from `backend/db/migrations`

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



