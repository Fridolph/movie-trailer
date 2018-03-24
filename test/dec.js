class Boy {
  @speak('中文')
  run() {
    console.log(`I can run and speak ${this.language}`)
  }
}

function speak(language) {
  return function(target, key, descriptor) {
    console.log(target)
    console.log(key)
    console.log(descriptor)
    target.language = language

    return descriptor
  }
}

let fri = new Boy()
fri.run()