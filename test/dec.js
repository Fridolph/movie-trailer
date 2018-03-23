class Boy {
  @speak('中文')
  say() {
    console.log('hello')
    console.log('I can speak', this.language)
  }
}

const fri = new Boy()

fri.say()

function speak(language) {
  return function(target, key, descriptor) {
    target.language = language
    // console.log(descriptor)
    return descriptor
  }
}
