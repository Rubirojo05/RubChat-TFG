import fs from 'fs'

export const ulrImage = (file) =>{
    const arrayPath = file.path.split('\\')
    const nameImg = arrayPath.pop()
    const pathToSave = `${nameImg}`
    return pathToSave
}
export const deletelinkFile = ({path}) =>{
    try {
        if(!path) throw new Error('No hay imagen que eliminar')
        fs.unlinkSync(`src/uploads/users/${path}`)
    } catch (error) {
        console.error(error)
    }
}