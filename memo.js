#!/usr/bin/env node

/**
 * AWS RDS MySQL-based CLI 메모장
 *
 *   1. 새 메모 작성
 *   2. 메모 목록 보기
 *   3. 메모 읽기
 *   4. 종료
 */

const mysql = require("mysql2");
const readline = require("readline");
/* 1) Set up your AWS RDS credentials*/

const dbConfig = {
  host: "XXXXXXX.rds.amazonaws.com",
  user: "YOUR_RDS_USERNAME",
  password: "YOUR_RDS_PASSWORD",
  database: "YOUR_DATABASE_NAME",
};

// Create a connection pool
const pool = mysql.createPool(dbConfig).promise();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Show main menu
function showMainMenu() {
  console.log("\n===== 간단한 CLI 메모장 (AWS RDS) =====");
  console.log("1. 새 메모 작성");
  console.log("2. 메모 목록 보기");
  console.log("3. 메모 읽기");
  console.log("4. 종료");
}

// Handle main menu input
function handleMainMenu() {
  rl.question("원하는 작업을 선택하세요 (1-4): ", (answer) => {
    switch (answer.trim()) {
      case "1":
        createMemo();
        break;
      case "2":
        listMemos();
        break;
      case "3":
        readMemo();
        break;
      case "4":
        console.log("메모장을 종료합니다.");
        // Close DB connection pool & rl
        pool.end().then(() => rl.close());
        break;
      default:
        console.log("잘못된 입력입니다. 다시 시도하세요.");
        handleMainMenu();
        break;
    }
  });
}

// 1. 새 메모 작성 -> INSERT INTO memos
async function createMemo() {
  rl.question("메모 제목을 입력하세요: ", (title) => {
    rl.question("메모 내용을 입력하세요: ", async (content) => {
      try {
        const sql = `INSERT INTO memos (title, content) VALUES (?, ?)`;
        await pool.query(sql, [title, content]);

        console.log("메모가 성공적으로 저장되었습니다!");
      } catch (err) {
        console.error("메모 저장 중 에러가 발생했습니다:", err);
      } finally {
        showMainMenu();
        handleMainMenu();
      }
    });
  });
}

// 2. 메모 목록 보기 -> SELECT id, title
async function listMemos() {
  try {
    const [rows] = await pool.query(
      `SELECT id, title FROM memos ORDER BY id DESC`
    );

    if (rows.length === 0) {
      console.log("저장된 메모가 없습니다.");
    } else {
      console.log("\n===== 메모 목록 =====");
      rows.forEach((row) => {
        console.log(`[${row.id}] ${row.title}`);
      });
    }
  } catch (err) {
    console.error("메모 목록을 불러오는 중 에러가 발생했습니다:", err);
  } finally {
    showMainMenu();
    handleMainMenu();
  }
}

// 3. 메모 읽기 -> SELECT content by ID
async function readMemo() {
  rl.question("읽을 메모 번호(ID)를 입력하세요: ", async (inputId) => {
    const id = parseInt(inputId, 10);
    if (isNaN(id)) {
      console.log("잘못된 번호입니다.");
      showMainMenu();
      handleMainMenu();
      return;
    }

    try {
      const [rows] = await pool.query(`SELECT * FROM memos WHERE id = ?`, [id]);

      if (rows.length === 0) {
        console.log("해당 ID의 메모가 존재하지 않습니다.");
      } else {
        const memo = rows[0];
        console.log(`\n===== 메모 #${memo.id} =====\n`);
        console.log(`제목: ${memo.title}`);
        console.log(`내용: ${memo.content}\n`);
        console.log(`작성 시각: ${memo.created_at}`);
      }
    } catch (err) {
      console.error("메모를 읽는 중 에러가 발생했습니다:", err);
    } finally {
      showMainMenu();
      handleMainMenu();
    }
  });
}

// Start program
showMainMenu();
handleMainMenu();
