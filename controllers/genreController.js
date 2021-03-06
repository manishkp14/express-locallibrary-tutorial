var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');
var validator = require('express-validator');


// Display all genre list
exports.genre_list = function(req, res, next){
    Genre.find().sort('name').exec(function(err, list_genres){
        if(err){
            return next(err);
        }
        res.render('genre_list',{title:'Genre List', genre_list:list_genres});
    });
};

// Display genre details 
exports.genre_detail = function(req, res, next){
    async.parallel({
        genre: function(callback){
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback){
            Book.find({'genre':req.params.id}).exec(callback);
        }
    }, function(err, result){
        if(err){
            return next(err);
        }
        if(result.genre === null){
            var err = new Error('Genre not fount');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', {
            title: 'Genre Details',
            genre: result.genre,
            genre_books: result.genre_books}
        );
    });
};

// display genre create form on get
exports.genre_create_get = function(req, res){
    res.render('genre_form',{title: 'Create Genre'});
};

// genre create post
exports.genre_create_post = [
    validator.body('name', 'Genre name required').isLength({min:1}).trim(),
    validator.sanitizeBody('name').escape().trim(),
    (req, res, next) => {
        
        const errors = validator.validationResult(req);
        var genre = new Genre({
            name: req.body.name
        });
        if(!errors.isEmpty()){
            res.render('genre_form',{title:'Create Genre', genre: genre, errors: errors.array()});
            return;
        }else{
            Genre.findOne({'name':req.body.name}).exec(function(err, found_genre){
                if(err){
                    return next(err);
                }
                if(found_genre){
                    // res.cookie('isValid', true, { maxAge: 900000, httpOnly: false});
                    res.redirect(found_genre.url);
                }else{
                    genre.save(function(err){
                        if(err){
                            return next(err);
                        }
                        res.redirect(genre.url);
                    });
                }
            });
            // res.send('genre create post');
        }
        console.log('response send');
    }
];

// display genre delete form on get
exports.genre_delete_get = function(req, res){
    res.send('genre delete get');
};

// genre delete on post
exports.genre_delete_post = function(req, res){
    res.send('genre delete on post');
};

// display genre update form on get
exports.genre_update_get = function(req, res){
    res.send('genre update on get');
};

// genre update on post
exports.genre_update_post = function(req, res){
    res.send('genre update on post');
};