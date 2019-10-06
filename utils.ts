import * as got from 'got'


export const formHerokuGitUrl = (apiKey: String, appName: String) => `https://heroku:${apiKey}@git.heroku.com/${appName}.git`


export const checkApplicationHealth = (appName: String) => got(`https://${appName}.herokuapp.com/health`)



let findReleases = function (heroku: any, app: String): Promise<any> {
    return heroku.get(`/apps/${app}/releases`, {
        partial: true,
        headers: { 'Range': 'version ..; max=10, order=desc' }
    })
}



export const rollbackDeployment = (heroku: any, app: String, release?: String) => {
    let id = (release || 'current').toLowerCase()
    id = id.startsWith('v') ? id.slice(1) : id
    if (id === 'current') {
        return findReleases(heroku, app).then(response => response.body).then(releases => releases.find((release: any) => release.status === "succeeded")[1])
    } else {
        return heroku.get(`/apps/${app}/releases/${id}`).then((response: any) => response.body)
    }
}
