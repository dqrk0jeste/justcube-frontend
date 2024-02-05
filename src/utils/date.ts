export function toDate(s: string) {
  return new Date(s)
}

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export function formatDate(date: Date) : string {
  return `${ months[date.getMonth()] } ${ date.getDate() }, ${ date.getFullYear() }`
}

const MINUTE_IN_MILISECONDS = 60 * 1000
const HOUR_IN_MILISECONDS = 60 * 60 * 1000
const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000
const THIRTY_DAYS_IN_MILISECONDS = 30 * 24 * 60 * 60 * 1000
const YEAR_IN_MILISECONDS = 365 * 24 * 60 * 60 * 1000

export function timeSince(date: Date) : string {
  if(Date.now() - date.getTime() < MINUTE_IN_MILISECONDS) {
    return `right now`
  }

  if(Date.now() - date.getTime() < HOUR_IN_MILISECONDS) {
    return `${ ((Date.now() - date.getTime()) / MINUTE_IN_MILISECONDS).toFixed(0) } minutes ago`
  }

  if(Date.now() - date.getTime() < DAY_IN_MILISECONDS) {
    return `${ ((Date.now() - date.getTime()) / HOUR_IN_MILISECONDS).toFixed(0) } hours ago`
  }

  if(Date.now() - date.getTime() < THIRTY_DAYS_IN_MILISECONDS) {
    return `${ ((Date.now() - date.getTime()) / DAY_IN_MILISECONDS).toFixed(0) } days ago`
  }

  if(Date.now() - date.getTime() < YEAR_IN_MILISECONDS) {
    return `${ ((Date.now() - date.getTime()) / THIRTY_DAYS_IN_MILISECONDS).toFixed(0) } months ago`
  }

  return `${ ((Date.now() - date.getTime()) / YEAR_IN_MILISECONDS).toFixed(0) } years ago`
}