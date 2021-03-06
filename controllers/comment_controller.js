var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
console.log("Control paso autoload comentario")
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment){
		if (comment) {
			req.comment = comment;
			next();
		}else{next(new Error('No existe commentId='+ commentId))}
	}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
	};

// Post /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build(
		{texto: req.body.comment.texto,
		publicado: false,
		QuizId: req.params.quizId });	// crea objeto comment

	comment
	.validate()
	.then(
		function (err){
			if (err) {
				res.render('comment/new.ejs',
					{comment: comment, quizid: req.params.quizId, errors: err.errors});
			}else {
				comment 	// save: guarda en DB campos de texto del coment
				.save()
				.then(function(){res.redirect('/quizes/'+req.params.quizId)})
			}	// res.redirect: Redirección HTTP a lista de preguntas
		}
	).catch(function(error){next(error)});
};
// GET /quizes/ :quizId/comments/ :commentId/publish
exports.publish = function(req, res) {
console.log("Para comprobar");
console.log(req.comment);

	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
		.then(function(){res.redirect('/quizes/' +req.params.quizId);})
		.catch(function(error){next(error)});
};