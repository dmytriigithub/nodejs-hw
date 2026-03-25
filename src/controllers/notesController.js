import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {

  // Отримуємо параметри пагінації
  // і задаємо дефолтні значення
  const { page = 1, perPage = 10, tag, search, sortBy = "_id", sortOrder = "asc" } = req.query;

  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const notesQuery = Note.find();

  // Будуємо фільтр
  if (tag) {
    notesQuery.where("tag").equals(tag);
  }

  // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if (search) {
    notesQuery.where({ $text: { $search: search } });
  }

  // Виконуємо одразу два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// // Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Створити нотатку
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};


// Видалити нотатку за id
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};

// Редагувати нотатку за id
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};



