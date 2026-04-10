import { Schema } from 'mongoose';
import { model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      required: false,
      trim: true, // прибирає пробіли на початку та в кінці
      default: '',
    },
    tag: {
      type: String,
      required: false,
      enum: TAGS,
      default: 'Todo',
    },
    // Нова властивість
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Додаємо текстовий індекс: кажемо MongoDB, що по полю title, content можна робити $text
noteSchema.index(
  {
    title: "text",
    content: "text"
  },
  {
    name: "NoteTextIndex",
    weights: {
      title: 10,   // title важливіший
      content: 5
    },
    default_language: "english"
  }
);

export const Note = model('Note', noteSchema);
