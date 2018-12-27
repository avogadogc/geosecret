QUnit.test("display_encrypt_form", async assert => {
  var w = await loadSut("./index.html", "SUT")
  var ef = sutElement(w, "encrypt-form")
  var df = sutElement(w, "decrypt-form")

  assert.equal(ef.style.display, 'block')
  assert.equal(df.style.display, 'none')
  cleanSut(w)
})

QUnit.test("display_decrypt_form", async assert => {
  var w = await loadSut("./index.html#foobar")
  var ef = sutElement(w, "encrypt-form")
  var df = sutElement(w, "decrypt-form")

  assert.equal(ef.style.display, 'none')
  assert.equal(df.style.display, 'block')
  cleanSut(w)
})

QUnit.test("error-invalid-password", async assert => {
  var ERROR_MSG = "Password is too short, at least 6 characters expected"

  var w = await loadSut("./index.html")
  var e = sutElement(w, "encrypt-error-area")
  await tryEncrypt(w, "Hello World!", "")
  assert.equal(e.innerHTML, ERROR_MSG)
  await tryEncrypt(w, "Hello World!", ".")
  assert.equal(e.innerHTML, ERROR_MSG)
  await tryEncrypt(w, "Hello World!", "12345")
  assert.equal(e.innerHTML, ERROR_MSG)
  cleanSut(w)

  var w = await loadSut("./index.html#foo")
  var e = sutElement(w, "decrypt-error-area")
  await tryDecrypt(w, "")
  assert.equal(e.innerHTML, ERROR_MSG)
  await tryDecrypt(w, ".")
  assert.equal(e.innerHTML, ERROR_MSG)
  await tryDecrypt(w, "12345")
  assert.equal(e.innerHTML, ERROR_MSG)

  cleanSut(w)
})

QUnit.test("encrypt-decrypt", async assert => {
  var PLAIN = "Hello World!"
  var PASSWD = "secret_password_here"

  var w = await loadSut("./index.html")
  await tryEncrypt(w, PLAIN, PASSWD)

  assert.equal(sutElement(w, "decrypt-form").style.display, 'block')
  assert.equal(sutElement(w, "encrypt-form").style.display, 'none')

  assert.ok(sutElement(w, "decrypt-cyphertext").value.length > 0)
  await tryDecrypt(w, PASSWD)
  assert.equal(sutElement(w, "decrypt-cyphertext").value, PLAIN)
  cleanSut(w)
})

/**
 * Load SUT in an iframe and wait for it to become ready.
 * @param url to load
 * @return iframe's window
 */
function loadSut(url) {
  // The waiting here is implemented by making this method to return asynchronously
  // becoming completed when the inner document is done loading. Otherwise test
  // might start interacting with the content before it is ready
  return new Promise((resolve, reject) => {
    var iframe = document.createElement('iframe');
    iframe.setAttribute("src", url)
    iframe.onload = () => { resolve(iframe.contentWindow) }
    document.body.appendChild(iframe)
  })
}

function cleanSut(sutWindow) {
  document.body.removeChild(sutWindow.frameElement)
}

function sutElement(sutWindow, id) {
  return sutWindow.document.getElementById(id)
}

function tryEncrypt(w, plain, pwd) {
  return new Promise((resolve, reject) => {
    sutElement(w, "encrypt-plain").value = plain
    sutElement(w, "encrypt-pwd").value = pwd

    var ef = sutElement(w, "encrypt-form")
    // Complete the encryption process upon receiving done event
    ef.addEventListener("encryptDone", (e) => {
      console.log("encryptDone received")
      resolve()
    }, false)
    // Submit via element in order to invoke all handlers
    sutElement(w, "encrypt-submit").click()
  })
}

function tryDecrypt(w, pwd) {
  return new Promise((resolve, reject) => {
    sutElement(w, "decrypt-pwd").value = pwd

    var ef = sutElement(w, "decrypt-form")
    // Complete the decryption process upon receiving done event
    ef.addEventListener("decryptDone", (e) => {
      console.log("decryptDone received")
      resolve()
    }, false)
    // Submit via element in order to invoke all handlers
    sutElement(w, "decrypt-submit").click()
  })
}
