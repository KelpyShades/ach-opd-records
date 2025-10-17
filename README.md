
# 🏥 Hospital OPD & Insurance Entry System

**Local Web App + Self-Hosted Supabase + Auto Backup**

---

## 📘 Overview

A fully offline hospital data system that allows multiple agents to record **OPD Numbers**, **Insurance Numbers**, and **Insurance Codes** using a shared **web interface**.
Built with **Next.js** frontend and **self-hosted Supabase (PostgreSQL)** backend.


## MVP

- Insert data (OPD Number, Insurance Number, Insurance Code)
- Fetch a record
- Delete a record
- Show all records
- Filter Records by Year, Month, Day.

---

## ⚙️ System Architecture

```
HOSPITAL LOCAL NETWORK (LAN)
│
├── Agents → http://192.168.1.10:3000 (Next.js Web App)
│
└── Server → http://192.168.1.10:54323 (Supabase Dashboard)
       ├─ Supabase API + PostgreSQL Database
       ├─ Auto Daily Backups
       └─ Auto Restart on Power Recovery
```

---

## 🧱 Components

| Component                        | Description                             | Port    |
| -------------------------------- | --------------------------------------- | ------- |
| **Next.js App**                  | Frontend for data entry                 | `3000`  |
| **Supabase (Postgres + Studio)** | Backend database + management dashboard | `54323` |
| **Automatic Backup Script**      | Dumps DB daily at 2 AM                  | —       |

---

## 🧰 Installation

1. **Clone project folder**

   ```bash
   git clone <repo> /hospital-server
   cd /hospital-server
   ```

2. **Start all services**

   ```bash
   docker compose up -d
   ```

3. **Enable Docker autostart**

   ```bash
   sudo systemctl enable docker
   ```

---

## 💻 Access Points

| Role       | Address                     | Description               |
| ---------- | --------------------------- | ------------------------- |
| Agents     | `http://192.168.1.10:3000`  | Form for entering records |
| Management | `http://192.168.1.10:54323` | Supabase Studio dashboard |

---

## 🗄️ Database Structure

**Table: `records`**

| Column             | Type      | Notes            |
| ------------------ | --------- | ---------------- |
| `id`               | bigint    | Primary key      |
| `opd_number`       | text      | Required         |
| `insurance_number` | text      | Required         |
| `insurance_code`   | text      | Required         |
| `created_at`       | timestamp | Default: `now()` |

---

## 🔁 Auto-Restart Setup

* Each Docker service uses `restart: always`
* Docker enabled on system boot:

  ```bash
  sudo systemctl enable docker
  ```

This ensures full recovery after power loss.

---

## 💾 Backups

**Backup script:** `/hospital-server/backup-database.sh`

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M)
docker exec supabase-db pg_dump -U postgres > /hospital-server/backups/hospital_${TIMESTAMP}.sql
```

**Cron job:**
Runs daily at 2 AM

```
0 2 * * * /hospital-server/backup-database.sh
```

**Restore backup:**

```bash
psql -U postgres -f hospital_20251016_0200.sql
```

---

## 🔐 Security Guidelines

* Keep the server **LAN-only** (no internet access to ports 54322/54323).
* Protect the Supabase dashboard with strong credentials.
* Store backup copies on an **external drive** or another LAN PC.
* Optional: connect the server to a **UPS** for uninterrupted operation.

---

## 🧾 Summary

| Feature                        | Status |
| ------------------------------ | ------ |
| Offline operation              | ✅      |
| Multi-user safe                | ✅      |
| Auto backup & restore          | ✅      |
| Auto restart after outage      | ✅      |
| Unlimited storage (disk-based) | ✅      |
| Local management dashboard     | ✅      |

---

### 📂 Directory Snapshot

```
/hospital-server
 ├── docker-compose.yml
 ├── webapp/              # Next.js frontend
 ├── backups/             # Auto-saved SQL dumps
 ├── backup-database.sh
 └── .env
```

---

## 🚀 Quick Start

```bash
# Start everything
docker compose up -d

# Access app
http://192.168.1.10:3000

# Access dashboard
http://192.168.1.10:54323
```

---

Would you like me to format this as a **ready-to-download `README.md` file** (in Markdown format)?
