function init() {
    var encryptForm = document.getElementById("encrypt-form")
    var decryptForm = document.getElementById("decrypt-form")
    var resultForm = document.getElementById("result-form")

    // Create custom events for our forms being ready
    window.encryptDone = document.createEvent('event')
    encryptDone.initEvent('encryptDone', true, true);
    window.decryptDone = document.createEvent('event')
    decryptDone.initEvent('decryptDone', true, true);

    // Make sure correct form is displayed
    var chunks = document.URL.split('#')
    if (chunks.length > 1) {
        encryptForm.style.display = "none"
        decryptForm.style.display = "block"
        resultForm.style.display = "none"
        document.getElementById("decrypt-cyphertext").value = chunks[1]
    } else {
        encryptForm.style.display = "block"
        decryptForm.style.display = "none"
        resultForm.style.display = "none"
    }
}

function submitEncryptForm() {
    setEncryptError("")
    var pwdField = document.getElementById("encrypt-pwd")
    var plain = document.getElementById("encrypt-plain").value.trim()
    var pwd = pwdField.value
    pwdField.value = '' // Do not keep the password around longer than necessary
    encrypt(plain, pwd)
}

function encrypt(plain, password) {
    if (password.length < 6) {
        onEncryptionComplete("Password is too short, at least 6 characters expected", null)
        return
    }
    triplesec.encrypt ({
        data: new triplesec.Buffer(plain),
        key: new triplesec.Buffer(password),
        progress_hook: function (obj) { }
    }, onEncryptionComplete);
}

function onEncryptionComplete(err, buff) {
    if (err) {
        setEncryptError(err)
    } else {
        window.location.hash = '#' + buff.toString('base64')
        init()
    }
    document.getElementById("encrypt-form").dispatchEvent(window.encryptDone)
}

function setEncryptError(msg) {
    document.getElementById("encrypt-error-area").innerHTML = msg
}

function submitDecryptForm() {
    setDecryptError("")
    var pwdField = document.getElementById("decrypt-pwd")
    var plain = document.getElementById("decrypt-cyphertext").value.trim()
    var pwd = pwdField.value
    pwdField.value = '' // Do not keep the password around longer than necessary
    decrypt(plain, pwd)
}

function decrypt(data, password) {
    if (password.length < 6) {
        onDecryptionComplete("Password is too short, at least 6 characters expected", null)
        return
    }
    triplesec.decrypt({
        data: new triplesec.Buffer(data, "base64"),
        key: new triplesec.Buffer(password),
        progress_hook: function (obj) { }
    }, onDecryptionComplete);
}

function onDecryptionComplete(err, buff) {
    if (err) {
        // Assign human readable messages for known problems
        if (err.toString().includes('Signature mismatch or bad decryption key')) {
            err = "Invalid password provided (" + err + ")"
        } else if (err.toString().includes('Ciphertext underrun in header') || err.toString().includes("bad header")) {
            err = "Invalid encrypted text provided. Check the URL was transfered correctly (" + err + ")"
        }
        setDecryptError(err)
    } else {
        document.getElementById("result-plain").value = buff.toString("UTF-8")
        document.getElementById("decrypt-form").style.display = 'none'
        document.getElementById("result-form").style.display = 'block'
    }
    document.getElementById("decrypt-form").dispatchEvent(window.decryptDone)
}

function setDecryptError(msg) {
    document.getElementById("decrypt-error-area").innerHTML = msg
}
