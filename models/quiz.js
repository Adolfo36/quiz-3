// Definición del modelo de quiz con validación

module.exports =function(sequelize, DataTypes){
	return sequelize.define(
		'Quiz',
		{tema: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "--> Falta tema"}}
		},
		pregunta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "--> Falta pregunta"}}
		},
		respuesta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "--> Falta respuesta"}}
			}
		}
	);
}