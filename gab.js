const users = [
    { id: "00001", password: "pass1", balance: 100000, attempts: 0, blocked: false },
    { id: "00002", password: "pass2", balance: 200000, attempts: 0, blocked: false },
    { id: "00003", password: "pass3", balance: 150000, attempts: 0, blocked: false },
    { id: "00004", password: "pass4", balance: 300000, attempts: 0, blocked: false },
    { id: "00005", password: "pass5", balance: 250000, attempts: 0, blocked: false }
];

let currentUser = null;
let inactivityTimer = null;
let receiptNumber = 1;

const idInput = document.getElementById('ID');
const passwordInput = document.getElementById('pwd');
const form = document.getElementById('login-form');

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();
    const userId = idInput.value.trim();
    const password = passwordInput.value.trim();

    if (userId === "" || password === "") {
        alert("Tous les champs doivent être remplis.");
        return;
    }

    if (userId.length > 5) {
        alert("L'ID utilisateur doit contenir au maximum 5 chiffres.");
        return;
    }

    if (password.length > 8) {
        alert("Le mot de passe doit contenir au maximum 8 caractères.");
        return;
    }

    checkUserId(userId, password);
}

function checkUserId(userId, password) {
    const user = users.find(u => u.id === userId);
    if (user) {
        if (user.blocked) {
            alert("Votre compte est bloqué. Veuillez passer à l'agence la plus proche.");
        } else {
            checkPassword(user, password);
        }
    } else {
        alert("ID utilisateur incorrect. Veuillez réessayer.");
    }
}

function checkPassword(user, password) {
    if (password === user.password) {
        currentUser = user;
        user.attempts = 0;
        showMainMenu();
    } else {
        user.attempts++;
        handleFailedAttempt(user);
    }
}

function handleFailedAttempt(user) {
    if (user.attempts >= 3) {
        user.blocked = true;
        alert("Mot de passe incorrect. Votre compte est bloqué.");
    } else {
        alert(`Mot de passe incorrect, il vous reste ${3 - user.attempts} tentatives.`);
    }
    passwordInput.value = '';
}

function showMainMenu() {
    const section = document.getElementById('section');
    section.innerHTML = `
        <h1>Menu Principal</h1>
        <form>
            <button type="button" onclick="checkBalance()">Consulter le solde</button><br>
            <button type="button" onclick="showWithdrawalOptions()">Faire un retrait</button><br>
            <button type="button" onclick="endSession()">Quitter</button>
        </form>
    `;
    resetInactivityTimer();
}

function checkBalance() {
    resetInactivityTimer();
    alert(`Votre solde actuel est: ${currentUser.balance} FCFA`);
}

function showWithdrawalOptions() {
    resetInactivityTimer();
    const section = document.getElementById('section');
    section.innerHTML = `
        <h1>Options de retrait</h1>
        <form>
            <button type="button" onclick="withdraw(10000)">10 000 FCFA</button><br>
            <button type="button" onclick="withdraw(50000)">50 000 FCFA</button><br>
            <button type="button" onclick="customWithdrawal()">Autre montant</button><br>
            <button type="button" onclick="showMainMenu()">Retour</button>
        </form>
    `;
}

function withdraw(amount) {
    resetInactivityTimer();
    if (currentUser.balance >= amount) {
        currentUser.balance -= amount;
        showReceipt(amount);
    } else {
        alert("Solde insuffisant, veuillez recharger votre compte.");
    }
}

function customWithdrawal() {
    resetInactivityTimer();
    let amount = prompt("Entrez le montant à retirer (multiple de 1000 FCFA):");
    if (amount === null) return;
    amount = parseInt(amount, 10);

    if (isNaN(amount) || amount % 1000 !== 0) {
        alert("Le montant doit être un entier et un multiple de 1000 FCFA.");
        showWithdrawalOptions(); // Reste sur l'interface de retrait
    } else {
        withdraw(amount);
    }
}

function showReceipt(amount) {
    const date = new Date();
    alert(`
        Reçu
        Numéro de reçu: ${receiptNumber++}
        Numéro de carte: XXXX-XXXX-XXXX-${currentUser.id.slice(-4)}
        Montant retiré: ${amount} FCFA
        Date: ${date.toLocaleDateString()}
        Heure: ${date.toLocaleTimeString()}
        Solde restant: ${currentUser.balance} FCFA
    `);
    showWithdrawalOptions(); // Reste sur l'interface de retrait après un retrait réussi
}

function endSession() {
    currentUser = null;
    clearTimeout(inactivityTimer);
    alert("Session expirée. Veuillez vous reconnecter.");
    showLoginForm();
}

function showLoginForm() {
    const section = document.getElementById('section');
    section.innerHTML = `
        <h1>Connexion</h1>
        <form id="login-form">
            <label for="ID">Entrer votre identifiant</label><br>
            <input type="number" id="ID" placeholder="Entrer votre identifiant"><br>
            <label for="pwd">Mot de passe</label><br>
            <input type="password" id="pwd" placeholder="Entrer votre mot de passe"><br>
            <button type="submit">LOGIN</button>
        </form>
    `;
    document.getElementById('login-form').addEventListener('submit', handleSubmit);
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(endSession, 15000); // 15 secondes d'inactivité
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', handleSubmit);
});





 
