document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      const existe = usuarios.find(user => user.email === email);
      if (existe) {
        alert('Este correo ya está registrado.');
        return;
      }

      usuarios.push({ nombre, email, password });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('Registro exitoso. Ahora inicia sesión.');
      window.location.href = 'login.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuario = usuarios.find(user => user.email === email && user.password === password);

      if (usuario) {
        localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
        window.location.href = 'index.html';
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    });
  }
});
