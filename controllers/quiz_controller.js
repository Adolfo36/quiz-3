var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizID
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
				where: {id: Number(quizId)},
				include: [{model: models.Comment}]
			}).then(function(quiz) {
			if (quiz) { 
			req.quiz = quiz;
			next();
		}else { next(new Error("No existe quizId=" + quizId));}
	  }
	).catch(function(error) {next(error);});
};

// GET /quizes
exports.buscador = function(req, res) {
	res.render('quizes/buscador', { buscatema: "Tema a buscar", busqueda: "pregunta a buscar ", errors: []}
	).catch(function(error){next(error);})
};
exports.index = function(req, res, next) {
	//console.log(req.query.search);
	//console.log(req.query.search2);
	if (req.query.search2 !== ""){
		var consulta = (req.query.search2 || '').replace(" ","%");
		models.Quiz.findAll({where:["upper(tema) like upper (?)","%"+consulta+"%"], order: 'tema'}
	).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes, errors:[]});
	}).catch(function(error){next(error);})
	}else if (req.query.search !== ""){
		var consulta = (req.query.search || '').replace(" ","%");
		models.Quiz.findAll({where:["upper(pregunta) like upper (?)","%"+consulta+"%"], order: 'pregunta'}
	).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes, errors:[]});
	}).catch(function(error){next(error);})}
	else 
		{models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes, errors: []}
	).catch(function(error){next(error);});});}
};

// GRT /quizes/ :id
exports.show = function(req, res) {
//console.log("Control de paso *********************************");	
	res.render('quizes/show', {quiz: req.quiz, errors: []});	
};

// GET /quizes/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado =  'Correcto';
	}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};
// GET /quizes/autor
exports.creditos = function(req, res){
	res.render('author/creditos', {autor: 'Adolfo Cortell', errors: []});		
	};
// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(	// crea objeto quiz
		{tema: "Tema",pregunta: "Pregunta", respuesta: "Respuesta"}
		);
		res.render('quizes/new', {quiz: quiz, errors: []});
	};
// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de la instancia quiz
		res.render('quizes/edit', {quiz: quiz, errors: []});
	};
// DELETE /quizes/:id
exports.destroy = function(req, res){
	console.log("estoy en destroy");
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
	};
// POST /quizes/new
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );	// crea objeto quiz

	quiz
	.validate()
	.then(
		function (err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}else {
				quiz 	// save: guarda en DB campos pregunta y respuesta de quiz
				.save({fields: ["tema","pregunta", "respuesta"]})
				.then(function(){res.redirect('/quizes')})
			}	// res.redirect: Redirección HTTP a lista de preguntas
		}
	);
};
// POST /quizes/:id
exports.update = function(req, res){
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function (err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else {
				req.quiz 	// save: guarda en DB campos pregunta y respuesta de quiz
				.save({fields: ["tema","pregunta", "respuesta"]})
				.then(function(){res.redirect('/quizes');});
			}	// res.redirect: Redirección HTTP a lista de preguntas
		}
	);
};
