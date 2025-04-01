# StudyingNodeJS
AWS RDS, EC2, NodeJS를 이용하여 프로젝트를 만들어보자.
Git push 가 잘 되는지 확인

---

## CLI Memo App (AWS RDS Edition)

A simple command-line application that allows you to create, list, and read memos stored in an AWS RDS (MySQL) database. This project serves as a minimal demonstration of using Node.js to interact with a remote MySQL database for basic CRUD functionality.

### Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [Development](#development)
- [License](#license)

### Features

1. **Create Memo**  
   Prompt for a memo title and content, then store it in an AWS RDS (MySQL) database.

2. **List Memos**  
   Display an ordered list of all saved memos with their IDs and titles.

3. **Read Memo**  
   Retrieve detailed information (title, content, and timestamp) of a memo by its ID.

4. **Exit**  
   Gracefully exit the CLI application, closing the database connection pool.

### Prerequisites

- **Node.js** (version 12+ recommended).
- **NPM** or **Yarn** for package management.
- An **AWS RDS** instance running MySQL (or other MySQL-compatible service).
- A `memos` table in your RDS database (see [Database Setup](#database-setup) below).

### Installation

1. **Clone** this repository or download the source files.
2. Navigate into the project folder:
   ```bash
   cd cli-memo-app
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Configuration

Open `memo.js` and locate the `dbConfig` object:

```js
const dbConfig = {
  host: 'XXXXXX.rds.amazonaws.com', // Replace with your RDS endpoint
  user: 'YOUR_RDS_USERNAME',    // Replace with your RDS username
  password: 'YOUR_RDS_PASSWORD',// Replace with your RDS password
  database: 'YOUR_DATABASE_NAME'// Replace with your database name
};
```

- **host**: Your RDS endpoint (e.g., `example-cluster.cluster-XXXXXX.ap-northeast-2.rds.amazonaws.com`).
- **user**: A MySQL user with privileges to create/read data in the `memos` table.
- **password**: The password for the above user.
- **database**: The name of the database where your `memos` table is (e.g., `memo_db`).

**Security Tip:** For production or publicly visible projects, avoid committing credentials in plain text. Consider using environment variables or AWS Secrets Manager.

### Usage

After configuration, run the CLI with:

```bash
node memo.js
```

You will see a menu like:

```
===== 간단한 CLI 메모장 (AWS RDS) =====
1. 새 메모 작성
2. 메모 목록 보기
3. 메모 읽기
4. 종료
```

1. **Create a New Memo**  
   - Choose `1`, enter a memo title and content when prompted.

2. **List All Memos**  
   - Choose `2`, and the app prints an ordered list of all memos (showing their IDs and titles).

3. **Read a Memo**  
   - Choose `3`, then input the ID of the memo you want to read.

4. **Exit**  
   - Choose `4` to close the application (and the underlying database connection).

### Database Setup

Before using this tool, ensure that your MySQL database has a table named `memos` with appropriate columns. Here is a simple SQL example:

```sql
CREATE TABLE IF NOT EXISTS memos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

If you prefer a different schema, modify the queries in `memo.js` accordingly.

### Development

- **Dependencies**: `mysql2`, `readline`, etc.
- **Scripts**:  
  - `start`: runs `node memo.js`.
  - Additional scripts can be added as needed.

Feel free to extend functionality:
- Add **Update Memo** or **Delete Memo** commands (via `UPDATE` / `DELETE`).
- Integrate with an ORM (e.g., Sequelize, TypeORM) for more robust database interaction.
- Improve error handling, logging, or add user authentication.

### License

This project is licensed under the [MIT License](LICENSE). You’re free to use, modify, and distribute this code for your own purposes. If you make significant changes, please consider contributing back or sharing with the open-source community.

---

**Enjoy your CLI memo app!** If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request.
