var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
	};

// Post /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build(
		{texto: req.body.comment.texto,
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
