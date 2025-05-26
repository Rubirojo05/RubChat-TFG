export const errorHandler = (req,res,next) => {
    res.status(404).json({message:'No se ha encontrado la página en el servidor'})
}