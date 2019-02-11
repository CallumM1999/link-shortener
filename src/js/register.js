const form = document.querySelector('#form');

console.log('form', form)

const handleLogin = e => {
    console.log('login');

    console.log('email', e.target.email.value)


    e.preventDefault();


    fetch('register', {
        method: 'post',
        body: JSON.stringify({
            email: e.target.email.value,
            password: e.target.password.value
        }),
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then(res => {
        if (res.status === 200) {
            window.location = '/';
        } else {
            alert('error logging in, check console');
            console.log(res)
        }
    })
}

form.addEventListener('submit', handleLogin)