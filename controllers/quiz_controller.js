var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizID
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) { 
			req.quiz = quiz;
			next();
		}else { next(new Error("No existe quizId=" + quizId));}
	  }
	).catch(function(error) {next(error);});
};

// GET /quizes
exports.buscador = function(req, res) {
	res.render('quizes/buscador', { busqueda: "pregunta a buscar o deje en blanco para todas"}
	).catch(function(error){next(error);})
};
exports.index = function(req, res, next) {
	if (req.query.search !== ""){
		var consulta = (req.query.search || '').replace(" ","%");
		models.Quiz.findAll({where:["upper(pregunta) like upper (?)","%"+consulta+"%"]}
	).then(function(quizes){
	res.render('quizes/index.ejs',{quizes:quizes,errors:[]});
	}).catch(function(error){next(error);})
	}else 
		{models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes}
	).catch(function(error){next(error);});});}
};

// GRT /quizes/ :id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});	
};

// GET /quizes/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado =  'Correcto';
	}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
// GET /quizes/autor
exports.creditos = function(req, res){
	res.render('author/creditos', {autor: 'Adolfo Cortell'});		
	};

