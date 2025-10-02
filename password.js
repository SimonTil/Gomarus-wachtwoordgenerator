const upperChars = "ABCDEFGHJKLPQRTUVWYZ";
const lowerChars = "abcdefghijkpqrtuvwyz";
const numberChars = "2346789";
const symbolChars = "!@?-";

function verifyInput(){
    const upperEl = document.getElementById("caps");
    const lowerEl = document.getElementById("lowers");
    const numberEl = document.getElementById("numbers");
    const symbolEl = document.getElementById("symbols");
    const lengthEl = document.getElementById("numChars");

    if (!(upperEl.checked || lowerEl.checked || numberEl.checked || symbolEl.checked)) {
        alert('Vergeten aan te geven welke tekens in het wachtwoord moeten!');
        return 0;
    }
    if (lengthEl.value == ""){
        alert('Vergeten aantal karakters in te voeren');
        return 0;
    }
    if (isNaN(lengthEl.value) || lengthEl.value <= 0){
        alert('Foutieve invoer voor aantal karakters');
        return 0;
    }

    return 1;
}

function generatePassword(){
    const lengthEl  = document.getElementById("numChars");
    const upperEl   = document.getElementById("caps");
    const lowerEl   = document.getElementById("lowers");
    const numberEl  = document.getElementById("numbers");
    const symbolEl  = document.getElementById("symbols");
    

    const length  = parseInt(lengthEl.value);
    const upper   = upperEl.checked;
    const lower   = lowerEl.checked;
    const number  = numberEl.checked;
    const symbols = symbolEl.checked;

    var password = "";
    if (upper)   password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    if (lower)   password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    if (number)  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    if (symbols) password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));

    let allChars = "";
    if (upper)   allChars += upperChars;
    if (lower)   allChars += lowerChars;
    if (number)  allChars += numberChars;
    if (symbols) allChars += symbolChars;

    while (password.length < length){
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password until it meets the policies "no 2 identical chars on a row"
    do {
        var arr = password.split('');
        arr.sort(() => Math.random() - 0.5);
        password = arr.join('');
    } while(constraints(password));

    if (length < 4) {
        password = password.substring(0, length);
    }

    resetCopyButton();

    showCrackTime(password);
    return password;
}

function showCrackTime(password) {
    try {
        // Kijk welke sets aangevinkt zijn
        let activeCharset = "";
        if (document.getElementById("caps").checked)    activeCharset += upperChars;
        if (document.getElementById("lowers").checked)  activeCharset += lowerChars;
        if (document.getElementById("numbers").checked) activeCharset += numberChars;
        if (document.getElementById("symbols").checked) activeCharset += symbolChars;

        // Fallback als niets gekozen is (zou eigenlijk niet mogen door verifyInput)
        if (activeCharset === "") activeCharset = globalCharset;

        const index = getIndex(password, activeCharset);
        const seconds = index / 1000000;
        const result = formatTime(seconds);

        document.getElementById("cracktime").innerHTML =
            `Geschatte kraaktijd (brute-force): ${result}`;
    } catch (err) {
        document.getElementById("cracktime").innerText = err.message;
    }
}

function getIndex(password, charset) {
    const N = charset.length;
    let index = 0;
    for (let i = 0; i < password.length; i++) {
        const pos = charset.indexOf(password[i]);
        if (pos === -1) {
            throw new Error(`Teken '${password[i]}' zit niet in charset.`);
        }
        index = index * N + pos;
    }
    return index;
}

function formatTime(seconds) {
    const microsecond = 0.000001;
    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const year = 31556926;

    if (seconds < microsecond) return "< 1 microseconde";

    // Function to format the number: 2 significant numbers, dot for thousand-separator, comma for decimal-separator
    function fmt(value, singular, plural, precision) {
        let val = Number(value.toPrecision(precision));
        let formatted = val.toLocaleString("nl-NL");
        return `± ${formatted} ${val === 1 ? singular : plural}`;
    }

    if (seconds < 1) return fmt(seconds * 1000000, "microseconde", "microseconden", 2);
    if (seconds < 1) return fmt(seconds * 1000, "milliseconde", "milliseconden", 2);
    if (seconds < minute) return fmt(seconds, "seconde", "seconden", 3);
    if (seconds < hour) return fmt(seconds / minute, "minuut", "minuten", 2);
    if (seconds < day) return fmt(seconds / hour, "uur", "uren", 2);
    if (seconds < year) return fmt(seconds / day, "dag", "dagen", 3);

    let years = seconds / year;
    if (years > 10000000) {
        let expStr = years.toExponential(2);
        let [mantissa, exponent] = expStr.split("e");
        mantissa = mantissa.replace(".", ",");
        exponent = exponent.replace("+", "");
        return `± ${mantissa} × 10<sup>${exponent}</sup> jaren`;
    }

    return fmt(years, "jaar", "jaren", 4);
}


function copyToClipboard(){
    const text = document.getElementById("result").value;
    navigator.clipboard.writeText(text).then(function(){
        var button = document.getElementById("copy");
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

function constraints(password){
    // No more than 2 identical characters
    for (var i = 0; i < password.length - 1; i++) {
        if (password[i] === password[i + 1]) {
            return true;
        }
    }
    return false;
}

window.onload = function(){
    document.getElementById("result").value = generatePassword(12, true, true, true, true);
}