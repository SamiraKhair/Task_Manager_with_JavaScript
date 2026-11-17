const logEl = document.getElementById('log');

function log(message) {
  console.log(message);
  logEl.textContent += message + '\n';
  logEl.scrollTop = logEl.scrollHeight;
}

function section(title) {
  log(`\n===== ${title} =====`);
}

function demoExecutionContext() {
  section('1. Execution Context');

  log('hoistedVar before declaration: ' + hoistedVar);
  var hoistedVar = 'I am defined now';
  log('hoistedVar after declaration: ' + hoistedVar);

  log('Calling hoisted function: ' + sayHello());
  function sayHello() {
    return 'Hello from a hoisted function!';
  }

  function first() {
    log('→ enter first()');
    second();
    log('← exit first()');
  }
  function second() {
    log('  → enter second()');
    third();
    log('  ← exit second()');
  }
  function third() {
    log('    → enter third() (top of the call stack)');
    log('    ← exit third()');
  }
  first();

 
  const student = {
    name: 'Ostad Student',
    greet() {
      return 'this.name inside object method = ' + this.name;
    },
  };
  log(student.greet());
  log('Global object is window: ' + (globalThis === window));
  log('this inside a click handler = the clicked element: ' + this.id);
}

function demoEventLoop() {
  section('2. Event Loop');

  log('1. Sync: start');

  setTimeout(() => {
    log('5. Macrotask: setTimeout(0) callback');
  }, 0);

  Promise.resolve().then(() => {
    log('3. Microtask: Promise.then callback');
  });

  queueMicrotask(() => {
    log('4. Microtask: queueMicrotask callback');
  });

  log('2. Sync: end');
  log('   (Call stack is now empty → microtasks run → then macrotasks)');
}

function demoSetTimeout() {
  section('3. setTimeout()');
  log('Waiting 3 seconds...');

  const btn = document.getElementById('btn-timeout');
  btn.disabled = true;

  setTimeout(() => {
    log('⏰ Hello! This message appeared after 3 seconds.');
    btn.disabled = false;
  }, 3000);

  log('(This line runs immediately — setTimeout does not block)');
}

function demoSetInterval() {
  section('4. setInterval() Countdown');

  const btn = document.getElementById('btn-interval');
  const countdownEl = document.getElementById('countdown');
  let count = 10;

  btn.disabled = true;
  countdownEl.textContent = count;
  log('Countdown started: ' + count);

  const intervalId = setInterval(() => {
    count--;
    countdownEl.textContent = count;
    log('Tick: ' + count);

    if (count === 0) {
      clearInterval(intervalId);
      countdownEl.textContent = "Time's up!";
      log("🚀 Time's up! clearInterval() stopped the timer.");
      btn.disabled = false;
    }
  }, 1000);
}

function calculate(a, b, operation) {
  return operation(a, b);
}

function fetchUserData(userId, callback) {
  log(`Fetching user ${userId}... (simulated 1.5s delay)`);
  setTimeout(() => {
    if (userId <= 0) {
      callback('Invalid user id', null);
    } else {
      callback(null, { id: userId, name: 'Rahim', course: 'Full Stack Web Dev' });
    }
  }, 1500);
}

function demoCallback() {
  section('5. Callback Functions');

  const add = (x, y) => x + y;
  const multiply = (x, y) => x * y;
  log('calculate(5, 3, add) = ' + calculate(5, 3, add));
  log('calculate(5, 3, multiply) = ' + calculate(5, 3, multiply));

  function handleUser(error, user) {
    if (error) {
      log('❌ Callback error: ' + error);
      return;
    }
    log('✅ Callback received user: ' + JSON.stringify(user));
  }

  fetchUserData(1, handleUser);
  fetchUserData(0, handleUser);
}


function checkNumber(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (num % 2 === 0) {
        resolve(`${num} is even ✅`);
      } else {
        reject(new Error(`${num} is odd ❌`));
      }
    }, 1000);
  });
}

function demoPromise() {
  section('6. Promise (.then / .catch / .finally)');

  checkNumber(4)
    .then((result) => log('Resolved: ' + result))
    .catch((error) => log('Rejected: ' + error.message))
    .finally(() => log('finally → checkNumber(4) done'));

  checkNumber(7)
    .then((result) => log('Resolved: ' + result))
    .catch((error) => log('Rejected: ' + error.message))
    .finally(() => log('finally → checkNumber(7) done'));

  log('Promises created — results arrive in ~1 second...');
}

async function runCheck(num) {
  try {
    const result = await checkNumber(num);
    log('Resolved (await): ' + result);
  } catch (error) {
    log('Rejected (try/catch): ' + error.message);
  } finally {
    log(`finally → runCheck(${num}) done`);
  }
}

async function fetchTodo(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!response.ok) {
    throw new Error('HTTP error ' + response.status);
  }
  return response.json();
}

async function demoAsyncAwait() {
  section('7. Async / Await');

  await runCheck(4);
  await runCheck(7);

  log('Fetching a todo from JSONPlaceholder API...');
  try {
    const todo = await fetchTodo(1);
    log('✅ API response: ' + JSON.stringify(todo));
  } catch (error) {
    log('❌ API error: ' + error.message);
  }
}

const demoButtons = {
  'btn-context': demoExecutionContext,
  'btn-eventloop': demoEventLoop,
  'btn-timeout': demoSetTimeout,
  'btn-interval': demoSetInterval,
  'btn-callback': demoCallback,
  'btn-promise': demoPromise,
  'btn-async': demoAsyncAwait,
  'btn-clear': () => {
    logEl.textContent = '';
  },
};

Object.entries(demoButtons).forEach(([buttonId, handler]) => {
  document.getElementById(buttonId).addEventListener('click', handler);
});
