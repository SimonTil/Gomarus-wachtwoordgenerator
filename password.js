function verifyInput(){
    if (!document.forms[0].elements[0].checked &&
        !document.forms[0].elements[1].checked &&
        !document.forms[0].elements[2].checked &&
        !document.forms[0].elements[3].checked){
        alert('Vergeten aan te geven welke tekens in het wachtwoord moeten!');
        return 0;
    }
    if (document.forms[0].elements[4].value == ""){
        alert('Vergeten aantal karakters in te voeren');
        return 0;
    }
    if (isNaN(document.forms[0].elements[4].value)){
        alert('Foutieve invoer voor aantal karakters');
        return 0;
    }
    return 1;
}

function getRandomNum(lbound, ubound){
    return Math.floor(Math.random() * (ubound - lbound)) + lbound;
}

function getRandomChar(upper, lower, number, symbols){
    var upperChars = "ABCDEFGHJKLPQRSTUVWYZ";
    var lowerChars = "abcdefghijkpqrstuvwyz";
    var numberChars = "23456789";
    var symbolChars = "!@#%?&/";
    var charSet = "";
    
    if (upper == true) charSet += upperChars;
    if (lower == true) charSet += lowerChars;
    if (number == true) charSet += numberChars;
    if (symbols == true) charSet += symbolChars;

    return charSet.charAt(getRandomNum(0, charSet.length));
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