exports.get404 = (req, res, next) => {
  res
    .status(404)
    // .sendFile(path.join(__dirname, 'views' , '404.html'));
    .render('404', {pageTitle: '404 page', path: null})
};