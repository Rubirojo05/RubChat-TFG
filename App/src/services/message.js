import { instancePrivate } from "./axios"

export const deleteMessage = async (id) => {
    return await instancePrivate.delete("/message", { data: { id } })
}