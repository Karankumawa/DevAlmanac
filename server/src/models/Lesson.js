const mongoose = require('mongoose');

const CodeAnnotationSchema = new mongoose.Schema(
  {
    line: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: 'Insight', // e.g. Memory, Performance, Syntax, Security
    },
  },
  { _id: false }
);

const CodeSnippetSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      default: 'python',
    },
    code: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: 'snippet',
    },
    annotations: [CodeAnnotationSchema],
    simulatedOutput: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const PracticeChallengeSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    hints: [
      {
        type: String,
      },
    ],
    starterCode: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      required: true,
    },
    solutionExplanation: {
      type: String,
      default: '',
    },
    testCases: [
      {
        input: String,
        expected: String,
      },
    ],
  },
  { _id: false }
);

const LessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module ID is required'],
      index: true,
    },
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: [true, 'Track ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Lesson slug is required'],
      trim: true,
      lowercase: true,
    },
    overview: {
      type: String,
      required: [true, 'Lesson overview is required'],
    },
    content: {
      type: String,
      required: [true, 'Lesson markdown content is required'],
    },
    codeSnippets: [CodeSnippetSchema],
    commonPitfalls: [
      {
        type: String,
      },
    ],
    practiceChallenge: PracticeChallengeSchema,
    estimatedReadTime: {
      type: Number,
      default: 5,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of lesson slug per track
LessonSchema.index({ trackId: 1, slug: 1 }, { unique: true });
LessonSchema.index({ moduleId: 1, order: 1 });

// MongoDB Text Search Index across lesson titles, overviews, markdown content, and code snippets
LessonSchema.index(
  {
    title: 'text',
    overview: 'text',
    content: 'text',
    'codeSnippets.code': 'text',
    'codeSnippets.explanation': 'text',
    'codeSnippets.fileName': 'text',
  },
  {
    weights: {
      title: 10,
      overview: 6,
      'codeSnippets.code': 5,
      content: 3,
      'codeSnippets.explanation': 2,
    },
    name: 'DevAlmanacLessonTextIndex',
    language_override: 'none',
  }
);

module.exports = mongoose.model('Lesson', LessonSchema);
