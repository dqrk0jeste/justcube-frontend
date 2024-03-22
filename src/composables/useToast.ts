import { ref } from "vue"

export type Message = {
  heading: string,
  paragraph: string,
}

export const ERROR_MESSAGE: Message = {
  heading: 'there has been an error!',
  paragraph: 'please try again.'
}

export function welcomeMessage(username: string): Message {
  return {
    heading: `welcome back, ${ username }!`,
    paragraph: 'have a good time!',
  }
}

let timer = 0

export const currentMessage = ref<Message | null>(null)

export function newToastNotification(message: Message) {
  currentMessage.value = message
  clearTimeout(timer)
  timer = setTimeout(() => currentMessage.value = null, 4000)
}

