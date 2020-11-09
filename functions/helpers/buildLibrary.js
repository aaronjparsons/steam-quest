module.exports = async (channelData, steamLibrary) => {
  const completed = []
  const library = steamLibrary.filter(item => {
    if (channelData.ignored.includes(item.appid)) {
      return false
    }

    if (channelData.previouslyCompleted.includes(item.appid)) {
      item.completed = 'Previously Completed'
      completed.push(item)
      return false
    }

    if (Object.keys(channelData.completed).includes(item.appid)) {
      item.completed = channelData.completed[item.appid]
      completed.push(item)
      return false
    }


    if (channelData.votes[item.appid]) {
      item.totalVotes = Object.values(channelData.votes[item.appid]).reduce((a, b) => {
        return a + b
      }, 0)
    } else {
      item.totalVotes = 0
    }
    return true
  })

  return { library, completed }
}