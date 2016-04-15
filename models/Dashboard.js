var mongoose = require('mongoose');

var dashboardSchema = new mongoose.Schema({
  version: Number,
  allow_edit: Boolean,
  widgets: Array,
  datasources: Array,
  columns: Number
});


module.exports = mongoose.model('Dashboard', dashboardSchema);
