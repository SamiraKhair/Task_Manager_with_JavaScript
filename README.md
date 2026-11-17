#Async JavaScript & Task Manager

A small web project made with plain HTML, CSS and JavaScript (no frameworks, no jQuery, no libraries).
It has two parts:

1. **Async JavaScript Practice** — a page that shows how JavaScript runs asynchronous code.
2. **Task Manager** — a todo app that loads tasks from an API and lets you add, complete, delete and filter them.

## How to run

1. Clone the repository:
   ```bash
   git clone https://github.com/SamiraKhair/Task_Manager_with_JavaScript.git
   ```
2. Open the project folder:
   ```bash
   cd Task_Manager_with_JavaScript
   ```
3. Open `index.html` in your browser (double-click it, or use the **Live Server** extension in VS Code).

You need an internet connection, because the app loads data from the free
[JSONPlaceholder](https://jsonplaceholder.typicode.com/) API.

## Part 1: Async JavaScript Practice

Open `async-demo.html` (there is also a link at the top of the Task Manager page).
Each section has a **Run** button. The result is shown on the page and in the browser console.

- **Execution Context** — hoisting and the order functions are called.
- **Event Loop** — shows that normal code runs first, then Promises, then timers.
- **setTimeout()** — shows a message after 3 seconds.
- **setInterval()** — a countdown timer from 10 to 0.
- **Callback Functions** — a function passed into another function and called later.
- **Promises** — one example that resolves (even number) and rejects (odd number).
- **Async/Await** — the same Promise example written with `async/await`, plus a real API request.

## Part 2: Task Manager

Open `index.html`.

- Loads 10 todos from the API when the page opens (a loading spinner shows while waiting).
- Each todo shows its **ID**, **title** and **status** (Completed / Pending).
- Add a new task, tick it as completed, or delete it.
- Shows the number of **total**, **completed** and **pending** tasks.
- **Show All**, **Show Completed** and **Show Pending** buttons filter the list.
- Tasks are saved in the browser, so they stay after you refresh the page.

### How the code is organised (`app.js`)

- All tasks are kept in one array called `tasks`.
- Separate functions change the data: `addTask()`, `deleteTask()`, `toggleTask()`.
- One function, `render()`, updates the page whenever the data changes.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Task Manager page |
| `app.js` | Task Manager logic |
| `async-demo.html` | Async practice page |
| `async-demo.js` | Async practice examples |
| `style.css` | Styles for both pages |
