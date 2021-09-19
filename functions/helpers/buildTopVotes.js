module.exports = (data) => {
  let voteTotals = [];
  let topGames = null;
  for (const [key, value] of Object.entries(data.votes)) {
    // Top games
    const gameVotes = Object.values(value).reduce((a, b) => a + b)
    voteTotals.push({
      appid: key,
      total: gameVotes
    })
  }

  topGames = voteTotals.sort((a, b) => b.total - a.total).slice(0, 3)
  topGames = topGames.map(game => {
    const app = data.library.find(app => app.appid == game.appid)
    return {
      ...game,
      name: app.name
    }
  })

  return topGames;
}