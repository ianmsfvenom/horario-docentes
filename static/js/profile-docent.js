const completeNameField = document.getElementById("edit-name-profile");
const emailField = document.getElementById("edit-email-profile");
const telField = document.getElementById("edit-tel-profile");
const areaField = document.getElementById("edit-area-profile");
const usercompleteNameField = document.getElementById("edit-username");
const passwordField = document.getElementById("edit-password-profile");
const confirmPasswordField = document.getElementById("edit-confirm-password-profile");
const editProfileButton = document.getElementById("edit-profile-button");

async function editProfile() {

    const getProfileRequest = await fetch("/docent");

    if (!getProfileRequest.ok) {
        const error = await getProfileRequest.json();
        Swal.fire({ icon: 'error', title: 'Oops...', text: error.message, })
        return;
    }

    const profile = await getProfileRequest.json();
    
    completeNameField.value = profile.nome;
    emailField.value = profile.email;
    telField.value = profile.telefone;
    usercompleteNameField.value = profile.usuarios[0].usuario;
    areaField.value = profile.area;

    const bootstrapModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    bootstrapModal.show();
}


async function updateProfile() {

    if (!completeNameField.value || !emailField.value || !telField.value || !usercompleteNameField.value || !areaField.value) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Preencha todos os campos' })
        return;
    }

    if (passwordField.value != confirmPasswordField.value) {
        Swal.fire({ icon: 'error', title: 'Senhas diferentes', text: 'As senhas digitadas devem ser iguais' })
        return;
    }

    const updateProfileRequest = await fetch("/docent/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: completeNameField.value,
            email: emailField.value,
            area: areaField.value,
            telefone: telField.value,
            username: usercompleteNameField.value,
            password: passwordField.value == "" ? undefined : passwordField.value
        })
    });

    if (!updateProfileRequest.ok) {
        const error = await updateProfileRequest.json();
        Swal.fire({ icon: 'error', title: 'Oops...', text: error.message, })        
        return;
    }

    Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Perfil atualizado com sucesso' })
    .then(() => {
        window.location.reload();
    })
}


editProfileButton.addEventListener("click", updateProfile);