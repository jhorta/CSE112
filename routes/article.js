
/*
 * GET article page.
 */

exports.show = function(req, res, next) {
  if (!req.params.slug) return next(new Error('No article slug.'));
  req.models.Article.findOne({slug: req.params.slug}, function(error, article) {
    if (error) return next(error);
    res.render('article', article);
  });
};


/*
 * GET articles API.
 */

exports.list = function(req, res, next) {
  req.models.Article.list(function(error, articles) {
    if (error) return next(error);
    res.send({articles: articles});
  });
};


/*
 * POST article API.
 */

exports.add = function(req, res, next) {
  if (!req.body.article) return next(new Error('No article payload.'));
  var article = req.body.article;
  req.models.Article.create(article, function(error, articleResponse) {
    if (error) return next(error);
    res.send(articleResponse);
  });
};


/*
 * PUT article API.
 */

exports.edit = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  req.models.Article.findById(req.params.id, function(error, article) {
    if (error) return next(error);
    if(!article) {
        return next("Article not found\n");
    }
    if(!req.body.comments) return next("No valid comment found");
    article.update({$push: {comments: req.body.comments}}, function(error, count, raw){
      if (error) return next(error);
      res.send({affectedCount: count});
    })
  });
};

/*
 * DELETE article API.
 */

exports.delComment = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  req.models.Article.findById(req.params.id, function(error, article) {
    if (!article || error) return next('Article not found\n');
    article.update({$pull: {comments: req.body.comments}}, function(error, count, raw) {
      if (error) return next(error);
      res.send({affectedCount: count});
    });
  });
};

/*
 * DELETE article API.
 */

exports.del = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  req.models.Article.findById(req.params.id, function(error, article) {
    if (!article || error) return next('Article not found\n');
    article.remove(function(error, doc){
      if (error) return next(error);
      res.send(doc);
    });
  });
};


/*
 * GET article POST page.
 */

exports.post = function(req, res, next) {
  if (!req.body.title)
  res.render('post');
};



/*
 * POST article POST page.
 */

exports.postArticle = function(req, res, next) {
  if (!req.body.title || !req.body.text ) {
    return res.render('post', {error: "Fill title and text."});
  }
  var article = {
    title: req.body.title,
    comment: req.body.slug,
    text: req.body.text,
  };
  req.models.Article.create(article, function(error, articleResponse) {
    if (error) return next(error);
    res.send(article);
  });
};
