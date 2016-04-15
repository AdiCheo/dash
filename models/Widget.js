var mongoose = require('mongoose');

var widgetSchema = new mongoose.Schema({

  
  id: { type: String, unique: true, lowercase: true },
  title: String,
});


module.exports = mongoose.model('Widget', widgetSchema);
