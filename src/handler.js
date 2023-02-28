const { nanoid } = require('nanoid');
const books = require('./books');
// const storage = require('./storage');

// menyimpan buku
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // input tidak mencantumkan nama
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // jumlah halaman yang dibaca tidak sesuai
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const saveBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(saveBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201); // HTTP response status code => created
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak berhasil ditambahkan',
  });

  response.code(500); // HTTP response status code => Internal Server Error
  return response;
};

// mendapatkan seluruh data buku
const getAllBooksHandler = (request, h) => {
  const mapping = books.map(({ id, name, publisher }) => ({ id, name, publisher }));

  const { name, reading, finished } = request.query;
  // const allBooks = [...storage.values()];
  // let searchQuery = allBooks;

  // search query name
  if (name) {
    const nameQuery = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: nameQuery,
      },
    }).code(200);
    // searchQuery = allBooks
    // .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  // search query reading
  if (reading) {
    const readingQuery = books.filter((book) => book.reading === (reading === '1'))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: readingQuery,
      },
    }).code(200);
  }

  // search query finished
  if (finished) {
    const finishedQuery = books.filter((book) => book.finished === (finished === '1'))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: finishedQuery,
      },
    }).code(200);
  }

  // const booksResult = searchQuery.map((book) => ({
  //   id: book.id,
  //   name: book.name,
  //   publisher: book.publisher,
  // }));

  return h.response({
    status: 'success',
    data: {
      books: mapping,
    },
  }).code(200);
};

// mendapatkan spesifik data buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// mengubah data buku
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // input tidak mencantumkan nama
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // jumlah halaman yang dibaca tidak sesuai
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // mendapatkan index array pada objek books sesuai id yang ditentukan
  const index = books.findIndex((book) => (book.id === bookId));

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);
  const [book] = books.filter((b) => b.id === bookId);

  if (book !== undefined) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
