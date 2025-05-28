import { describe, it, expect, vi } from 'vitest'
import * as imgUtils from '../utils/pathOfImg.js'
import fs from 'fs'

describe('pathOfImg.js', () => {
    it('ulrImage devuelve el nombre del archivo', () => {
        const file = { path: 'src\\uploads\\users\\foto.png' }
        const result = imgUtils.ulrImage(file)
        expect(result).toBe('foto.png')
    })

    it('deletelinkFile elimina el archivo si existe', () => {
        const unlinkSync = vi.spyOn(fs, 'unlinkSync').mockImplementation(() => { })
        imgUtils.deletelinkFile({ path: 'foto.png' })
        expect(unlinkSync).toHaveBeenCalledWith('src/uploads/users/foto.png')
        unlinkSync.mockRestore()
    })

    it('deletelinkFile maneja error si no hay path', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { })
        imgUtils.deletelinkFile({ path: undefined })
        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()
    })
})