const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    title: String,
    note: String,
    cover: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'job' },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'worker' }],
    sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'sprint' },
    is_active: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    due_date: Date,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
