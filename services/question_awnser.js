const QuestionAwnser = require('../data/question_awnser');

async function findAll() {
  return await QuestionAwnser.find().populate('sujet');
}

async function find(questionAwnserId) {
  return await QuestionAwnser.findById(questionAwnserId).populate('sujet');
}

async function create(data) {
  const questionAwnser = new QuestionAwnser(data);
  return await questionAwnser.save();
}

async function createMany(questionsData) {
  return await QuestionAwnser.insertMany(questionsData);
}

async function update(questionAwnserId, data) {
  return await QuestionAwnser.findByIdAndUpdate(questionAwnserId, data, { new: true }).populate('sujet');
}

async function remove(questionAwnserId) {
  return await QuestionAwnser.findByIdAndDelete(questionAwnserId);
}

async function findByQuery(query) {
  console.log('findByQuery:', query);
  return await QuestionAwnser.find(query).populate('sujet');
}

async function findByFilter(filter) {
  return await QuestionAwnser.find(filter).populate('sujet');
}

module.exports = {
  findAll,
  find,
  create,
  createMany,
  update,
  remove,
  findByQuery,
  findByFilter
};
