const login = require("fca-delta");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

// ──────────────────────────────────────────────────────────────
//  FLEXIBLE LOGIN SYSTEM — EMAIL/PASSWORD OR COOKIE
// ──────────────────────────────────────────────────────────────

async function flexibleLogin(config) {
  return new Promise(async (resolve, reject) => {
    const accountPath = path.join(process.cwd(), "account.txt");
    let loginData = null;

    try {
      // ① Try Email/Password from config.json first
      if (config.facebookAccount?.email && config.facebookAccount?.password) {
        console.log(chalk.cyan("[LOGIN] Attempting email/password login..."));
        
        loginData = {
          email: config.facebookAccount.email,
          password: config.facebookAccount.password,
          "2faSecret": config.facebookAccount["2FASecret"] || undefined
        };

        login(loginData, { 
          ...config.optionsFca,
          forceLogin: true 
        }, (err, api) => {
          if (err) {
            console.log(chalk.yellow("[LOGIN] Email/password failed, trying account.txt..."));
            tryAccountFile();
          } else {
            console.log(chalk.green("[LOGIN] ✅ Email/password login successful!"));
            resolve(api);
          }
        });
      } else {
        // No email/password, try account file directly
        tryAccountFile();
      }

      // ② Fallback to account.txt
      function tryAccountFile() {
        if (fs.existsSync(accountPath)) {
          try {
            console.log(chalk.cyan("[LOGIN] Reading account.txt..."));
            loginData = fs.readFileSync(accountPath, "utf8").trim();
            
            if (!loginData) {
              throw new Error("account.txt is empty");
            }

            // Try as appstate (JSON)
            try {
              loginData = JSON.parse(loginData);
              console.log(chalk.cyan("[LOGIN] Attempting appstate.json login..."));
            } catch {
              // Try as cookie string
              console.log(chalk.cyan("[LOGIN] Attempting cookie login..."));
              loginData = { cookies: loginData };
            }

            login(loginData, config.optionsFca, (err, api) => {
              if (err) {
                console.error(chalk.red("[LOGIN] Account.txt login failed:", err.message));
                reject(err);
              } else {
                console.log(chalk.green("[LOGIN] ✅ Account.txt login successful!"));
                resolve(api);
              }
            });
          } catch (e) {
            console.error(chalk.red("[LOGIN] Error reading account.txt:", e.message));
            reject(e);
          }
        } else {
          console.error(chalk.red("[LOGIN] ❌ No login method available!"));
          console.error(chalk.yellow("Please provide either:"));
          console.error(chalk.yellow("  1. email & password in config.json"));
          console.error(chalk.yellow("  2. account.txt file with cookie/appstate"));
          reject(new Error("No login credentials found"));
        }
      }

    } catch (error) {
      reject(error);
    }
  });
}

// ──────────────────────────────────────────────────────────────
//  MAIN BOT STARTUP
// ──────────────────────────────────────────────────────────────

async function startBot() {
  try {
    console.log(chalk.blue.bold("\n╔════════════════════════════════════╗"));
    console.log(chalk.blue.bold("║   GOATBOT V2 - STARTING BOT         ║"));
    console.log(chalk.blue.bold("╚════════════════════════════════════╝\n"));

    // Load config
    const configPath = path.join(process.cwd(), "config.json");
    if (!fs.existsSync(configPath)) {
      throw new Error("config.json not found!");
    }

    const config = fs.readJsonSync(configPath);
    console.log(chalk.green("[CONFIG] Loaded successfully"));

    // Login with flexible method
    const api = await flexibleLogin(config);
    console.log(chalk.green("[API] Connected to Facebook!\n"));

    // Rest of your bot initialization code
    console.log(chalk.cyan("[BOT] Initializing bot systems..."));
    
    // Load bot handler, commands, events etc here
    // ... (your existing bot code)

    console.log(chalk.green.bold("\n✅ BOT STARTED SUCCESSFULLY!\n"));

  } catch (error) {
    console.error(chalk.red.bold("\n❌ BOT STARTUP FAILED!"));
    console.error(chalk.red(error.message));
    console.error(chalk.red(error.stack));
    process.exit(1);
  }
}

// Start bot
startBot();

module.exports = { flexibleLogin };
