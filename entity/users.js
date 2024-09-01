const Mongoose = require('../database')
const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  max_streak: {
    type: Number,
    required: true,
    default: 0 // Set default value if needed
  },
  current_streak: {
    type: Number,
    required: true,
    default: 0 // Set default value if needed
  },
  solved: {
   type : [],
  default:[{
      "2023-01-01": {
          "level1": 0,
          "level2": 0,
          "level3": 0
      }
  }]
}
});

const User = Mongoose.model("CodeUser", userSchema);

module.exports = User;