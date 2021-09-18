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

    // TODO: Temp disabled
    // if (channelData.votes[item.appid]) {
    //   item.totalVotes = Object.values(channelData.votes[item.appid]).reduce((a, b) => {
    //     return a + b
    //   }, 0)
    // } else {
    //   item.totalVotes = 0
    // }
    return true
  })

  return { library, completed }
}