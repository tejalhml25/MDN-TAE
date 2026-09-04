A responsive and interactive Tic-Tac-Toe game built using HTML, CSS,
JavaScript, and Tailwind CSS.

The player always plays as X and moves first, while the bot plays as
O. The game provides three difficulty levels and keeps track of the
scores.

🎮 Features

Play Tic-Tac-Toe against a computer bot.

Player is always X and the bot is O.

Three bot difficulty levels:

Doodling (Easy) -- random moves.

Paying Attention (Medium) -- uses basic winning, blocking,
center, and corner strategies.

Sharp Chalk (Hard) -- uses the Minimax algorithm and is
designed to play optimally.

Scoreboard for:

Player wins

Draws

Bot wins

Animated X and O marks.

Animated winning strike-through line.

Wipe the board button to start a new round.

Responsive design for desktop and mobile screens.

Accessible buttons and status messages.

Chalkboard-inspired visual design.

🛠️ Technologies Used

HTML5 -- page structure and semantic elements.

CSS3 -- custom styling, animations, colors, and responsive
design.

JavaScript -- game logic, bot AI, score tracking, and
interactions.

Tailwind CSS -- utility classes for responsive layout and
styling.

Google Fonts -- Kalam and Space Grotesk.

📁 Project Structure

Chalk-and-Slate/
│
├── index.html
├── style.css
├── script.js
└── README.md

▶️ How to Run Locally

Download or clone this repository.

Open the project folder.

Open index.html in a web browser.

For the best development experience, you can also use VS Code with
Live Server.

🌐 GitHub Pages Deployment

This project can be deployed directly using GitHub Pages.

Steps

Create a public GitHub repository.

Upload:

index.html

style.css

script.js

README.md

Go to Settings → Pages.

Under Build and deployment, select:

Source: Deploy from a branch

Branch: main

Folder: / (root)

Click Save.

Wait for GitHub Pages to publish the website.

Open the generated GitHub Pages URL.

Example:

https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/

🧠 Bot Logic

The bot has three modes:

Easy

The bot selects an available cell randomly.

Medium

The bot: 1. Tries to win. 2. Tries to block the player's winning move.
3. Takes the center if available. 4. Chooses a corner. 5. Otherwise
selects an available cell.

Hard

The bot uses the Minimax algorithm to evaluate possible game states
and select the best move.

📊 Game Rules

The player uses X.

The bot uses O.

Players take turns placing their marks.

The first player to get three marks in a row wins.

Three marks can be horizontal, vertical, or diagonal.

If all cells are filled without a winner, the game is a draw.

♿ Accessibility

The project includes: - Semantic HTML elements. - Accessible labels for
board cells. - Keyboard-focus styling. - Live status updates using
aria-live. - Reduced-motion support for users who prefer less
animation.

📱 Responsive Design

The interface is designed to work on: - Desktop computers - Laptops -
Tablets - Mobile phones

📌 Project Purpose

The purpose of this project is to demonstrate frontend web development
concepts including:

Responsive UI design

HTML5 structure

CSS styling and animations

JavaScript DOM manipulation

Event handling

Game-state management

Basic AI decision-making

Minimax algorithm

GitHub and GitHub Pages deployment
