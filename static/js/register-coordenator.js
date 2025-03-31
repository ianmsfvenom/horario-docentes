const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = e.target.senhaLogin.value
    const confirmPassword = e.target.confirmaSenha.value
    const user = e.target.userLogin.value
    const name = e.target.name.value
    const email = e.target.email.value
    const phone = e.target.phone.value
    const securityKey = e.target["security-key"].value

    if(password !== confirmPassword)
        return alert("As senhas não são iguais");


    try {
        const registerRequest = await fetch("/login/register/coordenator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user, password, name, email, phone, securityKey })
        });

        if(!registerRequest.ok) {
            const error = await registerRequest.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            })
        }

        if(registerRequest.ok) {
            const success = await registerRequest.json();
            Swal.fire({
                icon: 'success',
                title: 'Cadastro realizado com sucesso',
                text: success.message,
            }).then(() => {
                window.location.href = "/login";
            })
        }

    } catch (error) {
        console.log(error);
    }
})