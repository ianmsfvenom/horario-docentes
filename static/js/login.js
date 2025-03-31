const redirectRegisterDocent = () => window.location.href = "/login/register/docent";
const redirectRegisterCoordenator = () => window.location.href = "/login/register/coordenator";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = e.target.userLogin.value
    const password = e.target.senhaLogin.value

    try {
        const loginRequest = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user, password })
        });

        if(!loginRequest.ok) {
            const error = await loginRequest.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            })
            return;
        }

        const response = await loginRequest.json()

        if(response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Login realizado com sucesso'
            })

            window.location.href = "/home";
        }
        
    } catch (error) {
        console.log(error);
    }
})