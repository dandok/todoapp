// import axios from 'axios';

const userToken = () => {
  const value = document.cookie
    .split(';')
    .find((x) => x.trim().startsWith('token'));
  token = value ? value.split('=')[1] : null;
  return token;
};

const signin = async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  fetch(`/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('sas');
      if (data.message) {
        const variant = document.querySelector('.variant');
        variant.style.display = 'flex';
        variant.textContent = data.message;
        return;
      }
      window.location.replace('/todos');
    })
    .catch((err) => console.log(err));
};

const logout = async (e) => {
  e.preventDefault();

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
  window.location.reload()

};

const registration = async (e) => {
  e.preventDefault();

  const name = document.querySelector('#name1').value;
  const email = document.querySelector('#email1').value;
  const password = document.querySelector('#password1').value;
  const password1 = document.querySelector('#confirmPassword1').value;
  if (password !== password1 || password.length < 7) {
    const error = document.querySelector('#regerror');
    error.style.display = 'block';
    const error1 = "password isn't a match";
    const error2 = 'password length is less than 7';
    error.textContent = password.length < 7 ? error2 : error1;
    return;
  }

  fetch(`/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        const variant = document.querySelector('.variant');
        variant.style.display = 'flex';
        variant.textContent = data.message;
        return;
      }
      window.location.replace('/todos');
    })
    .catch((err) => console.log(err));
};

const todoAdd = (e) => {
  e.preventDefault();
  const input = document.querySelector('.todoinput');
  input.style.display = 'flex';
};

const todoSubmit = async (e) => {
  e.preventDefault();
  const description = document.querySelector('#todoInput').value;
  const title = document.querySelector('#todoTitle').value;
  if (!title || !description) {
    const error = document.querySelector('#todoerror');
    error.style.display = 'block';
    error.textContent = 'Both title and description are required';
    return;
  }
  const token = userToken();
  fetch(`/todo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
  const input = document.querySelector('.todoinput');
  input.style.display = 'none';
};

const editTodo = (e, id) => {
  e.preventDefault();
  const content = document.querySelector(`.content${id}`);
  const butn = document.querySelector(`.button${id}`);
  content.style.display = 'none';
  butn.style.display = 'none';
  const updateinput = document.querySelector(`#update${id}`);
  updateinput.style.display = 'flex';
};

const updateTodo = async (e, id) => {
  e.preventDefault();
  const description = document.querySelector(`.description${id}`).value;
  const title = document.querySelector(`.title${id}`).value;

  let completed = false;
  const done = document.querySelector(`#done${id} input[type="radio"]:checked`);
  if (done) {
    if (done.value === 'done') {
      completed = true;
    }
  }
  const token = userToken();

  fetch(`/todo/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, completed }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
};

const deleteTodo = async (e, id) => {
  e.preventDefault();
  const token = userToken();
  fetch(`/todo/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
};
