function validate(schema, target = 'body') {
    return (req, res, next) => {
    const data = req[target];
    //paso 1 . verificar que haya datos
    if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'No data provided' });
        }
        //paso 2 . validar contra el schema con opciones
        const { error, value } = schema.validate(data, {
            abortEarly: false, //no detenerse en el primer error mostrar todos los errores
            stripUnknown: true, //eliminar campos no definidos en el schema  

        })
        //paso 3 . si hay error devolver 400 con los errores con messaje claro 

        if (error) {

            return res.status(400).json({
                message: `error de validación en ${target}`,
                errores: error.details.map(err => err.message)
            })              
        }

        //paso 4 . remplazar el objeto original con datos limpios
        req[target] = value;

        //continuamos ....
        next();
   
    }
}

export default validate;