const validate = values => {
  const errors = {}

  // TODO: Finish validation
  if (values.tutkintomuutokset) {
    errors.tutkintomuutokset = []
    values.tutkintomuutokset.forEach(muutos => {
      if (isEmpty(muutos.perustelu)) {
        errors.tutkintomuutokset.push({ koodiarvo: muutos.koodiarvo, error: "Kirjoita perustelu" })
      }
    })
  }

  return errors
}

function isEmpty(string) {
  if (!string) {
    return true
  }

  if (string === null) {
    return true
  }

  if (string === "") {
    return true
  }

  return false
}

export default validate
