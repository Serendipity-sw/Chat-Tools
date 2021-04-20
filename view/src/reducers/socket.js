const socket = (state = null, action) => {
  switch (action.type) {
    case 'addSocket':
      return action.object
    case 'delSocket':
      return null
    default:
      return state
  }
}

export default socket


export const addSocket = object => {
  return {type: 'addSocket', object}
}

export const delSocket = () => {
  return {type: 'delSocket'}
}