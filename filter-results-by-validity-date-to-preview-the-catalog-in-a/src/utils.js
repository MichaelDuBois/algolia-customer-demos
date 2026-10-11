// Takes a date input and turns it into a timestamp
export const dateToTimestamp = date => {
  return +new Date(date) / 1000
}

// Takes a timestamp and turns it into a string with format d/m/yyyy
export const timestampToDateString = timestamp => {
  return new Date(timestamp * 1000).toLocaleDateString('it-IT')
}
