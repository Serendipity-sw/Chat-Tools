const expression = (state = [], action) => {
  switch (action.type) {
    case 'expressionChange':
      return action.obj
    case 'delChat':
      return []
    default:
      return state
  }
}

export default expression

export const expressionChange = obj => {
  return {type: 'expressionChange', obj}
}