function init() {
    // Make sure correct form is displayed
    var chunks = document.URL.split('#')
    var encryptFormDisplay = document.getElementById("encrypt-form").style
    var decryptFormDisplay = document.getElementById("decrypt-form").style
    if (chunks.length > 1) {
        encryptFormDisplay.display = "none"
        decryptFormDisplay.display = "block"
        document.getElementById("decrypt-cyphertext").value = chunks[1]
    } else {
        encryptFormDisplay.display = "block"
        decryptFormDisplay.display = "none"
    }

    // Remove readonly attribute from password fields - this prevent browsers from attempting to save them
    document.getElementById("encrypt-pwd").removeAttribute("readonly")
    document.getElementById("decrypt-pwd").removeAttribute("readonly")
}

function submitEncryptForm() {
    var plain = document.getElementById("encrypt-plain").value.trim()
    var pwd = document.getElementById("encrypt-pwd").value
    encrypt(plain, pwd)
}

function onEncryptionComplete(err, buff) {
    if (err) {
        document.getElementById("encrypt-error-area").innerHTML = err
    } else {
        window.location.hash = '#' + buff.toString('base64')
        init()
    }
}

function encrypt(plain, password) {
    triplesec.encrypt ({
        data: new triplesec.Buffer(plain),
        key: new triplesec.Buffer(password),
        progress_hook: function (obj) { }
    }, onEncryptionComplete);
}

function submitDecryptForm() {
    var plain = document.getElementById("decrypt-cyphertext").value.trim()
    var pwd = document.getElementById("decrypt-pwd").value
    decrypt(plain, pwd)
}

function decrypt(data, password) {
    triplesec.decrypt({
        data: new triplesec.Buffer(data, "base64"),
        key: new triplesec.Buffer(password),
        progress_hook: function (obj) { }
    }, onDecryptionComplete);
}

function onDecryptionComplete(err, buff) {
    if (err) {
        document.getElementById("decrypt-error-area").innerHTML = err
    } else {
        document.getElementById("decrypt-pwd").value = ""
        document.getElementById("decrypt-cyphertext").value = buff.toString("UTF-8")
    }
}
