function verifyInput(){
    const form = document.forms[0];
    if (![0, 1, 2, 3].some(i => form.elements[i].checked)) {
        alert('Vergeten aan te geven welke tekens in het wachtwoord moeten!');
        return 0;
    }
    if (form.elements[4].value == ""){
        alert('Vergeten aantal karakters in te voeren');
        return 0;
    }
    if (isNaN(form.elements[4].value) || form.elements[4].value <= 0){
        alert('Foutieve invoer voor aantal karakters');
        return 0;
    }
    return 1;
}

function getRandomChar(upper, lower, number, symbols){
    var upperChars = "ABCDEFGHJKLPQRSTUVWYZ";
    var lowerChars = "abcdefghijkpqrstuvwyz";
    var numberChars = "23456789";
    var symbolChars = "!@#%?&/";
    var charSet = "";

    if (upper) charSet += upperChars;
    if (lower) charSet += lowerChars;
    if (number) charSet += numberChars;
    if (symbols) charSet += symbolChars;

    return charSet.charAt(Math.floor(Math.random() * charSet.length));
}

function generatePassword(length, upper, lower, number, symbols){
    var password = "";
    
    if (upper) password += getRandomChar(true, false, false, false);
    if (lower) password += getRandomChar(false, true, false, false);
    if (number) password += getRandomChar(false, false, true, false);
    if (symbols) password += getRandomChar(false, false, false, true);

    while (password.length < length){
        password += getRandomChar(upper, lower, number, symbols);
    }

    while (has3IdenticalChars(password))
    {
        password = "";
        if (upper) password += getRandomChar(true, false, false, false);
        if (lower) password += getRandomChar(false, true, false, false);
        if (number) password += getRandomChar(false, false, true, false);
        if (symbols) password += getRandomChar(false, false, false, true);
        
        while (password.length < length){
            password += getRandomChar(upper, lower, number, symbols);
        }
    }

    var arr = password.split('');
    arr.sort(() => Math.random() - 0.5);
    password = arr.join('');

    if (length < 4) {
        password = password.substring(0, length);
    }

    resetCopyButton();
    return password;
}


function copyToClipboard(){
    var text = document.forms[0].elements[6].value;
    navigator.clipboard.writeText(text).then(function(){
        var button = document.forms[0].elements[7];
        button.innerText = "Gekopieerd!";
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-success');
    }, function() {
        alert("Kopiëren mislukt...");
    });
}

function resetCopyButton() {
    var button = document.forms[0].elements[7];
    button.innerText = "Kopieer";
    button.classList.remove('btn-success');
    button.classList.add('btn-outline-secondary');
}

function has3IdenticalChars(password) {
    for (var i = 0; i < password.length - 2; i++) {
        if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
            return true;
        }
    }
    return false;
}

window.onload = function(){
    document.forms[0].elements[6].value = generatePassword(12, true, true, true, true);
}