const upperChars = "ABCDEFGHJKLPQRTUVWYZ";
const lowerChars = "abcdefghijkpqrtuvwyz";
const numberChars = "2346789";
const symbolChars = "!@?-";
let copyTimeoutId = null;

function verifyInput(){
    const upperEl = document.getElementById("caps");
    const lowerEl = document.getElementById("lowers");
    const numberEl = document.getElementById("numbers");
    const symbolEl = document.getElementById("symbols");
    const lengthEl = document.getElementById("numChars");

    if (!(upperEl.checked || lowerEl.checked || numberEl.checked || symbolEl.checked)) {
        alert('Vergeten aan te geven welke tekens in het wachtwoord moeten!');
        return false;
    }
    if (lengthEl.value == ""){
        alert('Vergeten aantal karakters in te voeren');
        return false;
    }
    if (isNaN(lengthEl.value) || lengthEl.value <= 0){
        alert('Foutieve invoer voor aantal karakters');
        return false;
    }

    return true;
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

    // Seed one char per enabled charset, but never more than the requested length
    var password = "";
    let seedCount = 0;
    if (upper   && seedCount < length) { password += upperChars.charAt(randomChar(upperChars.length));  seedCount++; }
    if (lower   && seedCount < length) { password += lowerChars.charAt(randomChar(lowerChars.length));  seedCount++; }
    if (number  && seedCount < length) { password += numberChars.charAt(randomChar(numberChars.length)); seedCount++; }
    if (symbols && seedCount < length) { password += symbolChars.charAt(randomChar(symbolChars.length)); seedCount++; }

    let allChars = "";
    if (upper)   allChars += upperChars;
    if (lower)   allChars += lowerChars;
    if (number)  allChars += numberChars;
    if (symbols) allChars += symbolChars;

    while (password.length < length){
        password += allChars.charAt(randomChar(allChars.length));
    }

    // Shuffle until no two identical adjacent chars; cap at 1000 iterations
    let attempts = 0;
    do {
        var arr = password.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = randomChar(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        password = arr.join('');
        attempts++;
    } while(constraints(password) && attempts < 1000);

    resetCopyButton();

    showCrackTime(password, allChars);
    return password;
}

function randomChar(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
}

function showCrackTime(password, activeCharset) {
    if (activeCharset === "") return;

    const N = BigInt(activeCharset.length);
    const L = BigInt(password.length);

    let combinations = 1n;
    for (let i = 0n; i < L; i++) combinations *= N;

    // Average guesses = combinations / 2, at 1 billion guesses/sec
    const seconds = Number(combinations / 2n) / 1_000_000_000;

    document.getElementById("cracktime").innerHTML =
        `Geschatte kraaktijd (brute-force): ${formatTime(seconds)}`;
}

function formatTime(seconds) {
    const microsecond = 0.000001;
    const millisecond = 0.001;
    const second = 1;
    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const year = 31556926;

    if (seconds < microsecond) return "< 1 microseconde";

    // Function to format the number: 2 significant numbers, dot for thousand-separator, comma for decimal-separator
    function fmt(value, singular, plural, precision) {
        let val = Number(value.toPrecision(precision));
        let formatted = val.toLocaleString("nl-NL");
        return `±&nbsp;${formatted}&nbsp;${val === 1 ? singular : plural}`;
    }

    if (seconds < millisecond) return fmt(seconds * 1000000, "microseconde", "microseconden", 2);
    if (seconds < second) return fmt(seconds * 1000, "milliseconde", "milliseconden", 2);
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
        return `±&nbsp;${mantissa}&nbsp;×&nbsp;10<sup>${exponent}</sup>&nbsp;jaren`;
    }

    const val = Number(years.toPrecision(3));
    const formatted = val.toLocaleString("nl-NL", { useGrouping: val >= 10000 });
    return `±&nbsp;${formatted}&nbsp;${val === 1 ? "jaar" : "jaren"}`;
}

function copyToClipboard(){
    const text = document.getElementById("result").value;
    navigator.clipboard.writeText(text).then(function(){
        var button = document.getElementById("copy");
        button.innerText = "Gekopieerd!";
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-success');
        // Reset after 10 seconds
        copyTimeoutId = setTimeout(function() {
            resetCopyButton();
            copyTimeoutId = null;
        }, 10000);
    }, function() {
        alert("Kopiëren mislukt...");
    });
}

function resetCopyButton() {
    if (copyTimeoutId !== null) {
        clearTimeout(copyTimeoutId);
        copyTimeoutId = null;
    }
    var button = document.getElementById("copy");
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
    document.getElementById("result").value = generatePassword();
}