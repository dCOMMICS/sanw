var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


class Graph {
  constructor(points = [], segments = []) {
     this.points = points;
     this.segments = segments;
  }


  

  addPoint(point) {
     this.points.push(point);
  }

  containsPoint(point) {
     return this.points.find((p) => p.equals(point));
  }

  tryAddPoint(point) {
     if (!this.containsPoint(point)) {
        this.addPoint(point);
        return true;
     }
     return false;
  }

  removePoint(point) {
     const segs = this.getSegmentsWithPoint(point);
     for (const seg of segs) {
        this.removeSegment(seg);
     }
     this.points.splice(this.points.indexOf(point), 1);
  }

  addSegment(seg) {
     this.segments.push(seg);
  }

  containsSegment(seg) {
     return this.segments.find((s) => s.equals(seg));
  }

  tryAddSegment(seg) {
     if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
        this.addSegment(seg);
        return true;
     }
     return false;
  }

  removeSegment(seg) {
     this.segments.splice(this.segments.indexOf(seg), 1);
  }

  getSegmentsWithPoint(point) {
     const segs = [];
     for (const seg of this.segments) {
        if (seg.includes(point)) {
           segs.push(seg);
        }
     }
     return segs;
  }

  dispose() {
     this.points.length = 0;
     this.segments.length = 0;
  }

  draw(ctx) {
     for (const seg of this.segments) {
        seg.draw(ctx);
     }

     for (const point of this.points) {
        point.draw(ctx);
     }
  }
}