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

QUnit.test("encrypt-decrypt", async assert => {
  var w = await loadSut("./index.html")
  sutElement(w, "encrypt-plain").value = "Hello World!"
  sutElement(w, "encrypt-pwd").value = "secret_password_here"
  sutElement(w, "encrypt-form").submit()

  var df = sutElement(w, "decrypt-form")
  assert.equal(df.style.display, 'block')
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
