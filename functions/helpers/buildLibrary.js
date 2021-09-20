module.exports = async (channelData) => {
  const completed = []
  const library = channelData.library.filter(item => {
    if (item.ignored) {
      return false
    }

    if (item.previouslyCompleted) {
      item.completed = 'Previously Completed'
      completed.push(item)
      return false
    }

    if (item.completed) {
      completed.push(item)
      return false
    }

    return true
  })

  return { library, completed }
}