const loginFormHandler = async (event) => {

    event.preventDefault();
  

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {

      console.log('attempting login')
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log('reloading page, login successful')
        document.location.replace('/issues/submit_issue');
      } else {
        alert('Failed to log in');
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  