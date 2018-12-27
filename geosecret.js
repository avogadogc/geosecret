function init() {
    var encryptForm = document.getElementById("encrypt-form")
    var decryptForm = document.getElementById("decrypt-form")

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
        document.getElementById("decrypt-cyphertext").value = chunks[1]
    } else {
        encryptForm.style.display = "block"
        decryptForm.style.display = "none"
    }

    // Remove readonly attribute from password fields - this prevent browsers from attempting to save them
    document.getElementById("encrypt-pwd").removeAttribute("readonly")
    document.getElementById("decrypt-pwd").removeAttribute("readonly")
}

function submitEncryptForm() {
    setEncryptError("")
    var plain = document.getElementById("encrypt-plain").value.trim()
    var pwd = document.getElementById("encrypt-pwd").value
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
    var plain = document.getElementById("decrypt-cyphertext").value.trim()
    var pwd = document.getElementById("decrypt-pwd").value
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
        setDecryptError(err)
    } else {
        document.getElementById("decrypt-pwd").value = ""
        document.getElementById("decrypt-cyphertext").value = buff.toString("UTF-8")
    }
    document.getElementById("decrypt-form").dispatchEvent(window.decryptDone)
}

function setDecryptError(msg) {
    document.getElementById("decrypt-error-area").innerHTML = msg
}
