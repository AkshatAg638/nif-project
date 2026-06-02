import mongoose from 'mongoose';

/**
 * A simple auto-increment counter collection.
 * Each document holds a `seq` value for a named counter (e.g. 'receipt').
 */
const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

/**
 * Atomically increments and returns the next value for a named counter.
 * @param {String} name  Counter name (e.g. 'receipt')
 * @returns {Promise<Number>} The next sequential number
 */
counterSchema.statics.getNextSequence = async function (name) {
  const counter = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
