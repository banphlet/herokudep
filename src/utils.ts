import * as got from 'got'
import * as util from 'util'
import { readFile, writeFileSync } from 'fs'

const readFileSyncPromise = util.promisify(readFile)

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

export const readServicesJson = async (errorHandler: Function) => {
    const currentDir = process.cwd()
    try {
        const file = await readFileSyncPromise(`${currentDir}/services.json`, { encoding: "utf-8" })
        return file
    } catch (error) {
        errorHandler("No services.json file found. Run this command from your application root directory where the services.json file exist")
    }

}

export const writeFile = (str: string) => writeFileSync(`${process.cwd()}/Procfile`, str)



export const parseString = (str: string) => {
    try {
        return JSON.parse(str)
    } catch (error) {
        return str
    }
}