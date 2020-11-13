import Model from '@/js/jsonapi/Model';
import Transformer from '@/js/jsonapi/Transformer';

class Book extends Model {
  static type() {
    return 'books';
  }

  static fields() {
    return [
      'title',
      'isbn', // To test an unused field
    ];
  }
}

const book1 = {
  type: 'books',
  id: '1',
  attributes: {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software'
  }
};

const book2 = {
  type: 'books',
  id: '2',
  attributes: {
    title: 'Refactoring: Improving the Design of Existing Code'
  }
};

const jsonBook = {
  data: book1
};

const jsonBooks = {
  data: [
    book1,
    book2,
  ]
};

describe('Transformer - Deserialize with fields', () => {
  test('It should create an model instance with fields', () => {
    let transformer = new Transformer();
    let book = transformer.deserialize(Book, jsonBook);
    expect(book.title ===
      'Design Patterns: Elements of Reusable Object-Oriented Software'
    );
  });

  test('It should create an array with model instances with fields',
    () => {
      let transformer = new Transformer();
      let books = transformer.deserialize(Book, jsonBooks);
      expect(books.length === 2);
      expect(books[0].title ===
        'Design Patterns: Elements of Reusable Object-Oriented Software'
      );
    });
});

const authors = [
  {
    type: 'authors',
    id: '1',
    attributes: {
      name: 'Erich Gamma'
    }
  },
  {
    type: 'authors',
    id: '2',
    attributes: {
      name: 'Richard Helm'
    }
  },
  {
    type: 'authors',
    id: '3',
    attributes: {
      name: 'Ralph Johnson'
    }
  },
  {
    type: 'authors',
    id: '4',
    attributes: {
      name: 'John Vlissides'
    }
  },
];
book1.relationships = {
  author: {
    data: [
      {
        type: 'authors',
        id: '1'
      },
      {
        type: 'authors',
        id: '2'
      },
      {
        type: 'authors',
        id: '3'
      },
      {
        type: 'authors',
        id: '4'
      },
    ]
  }
};
jsonBook.included = authors;

const authorBook2 = {
  type: 'authors',
  id: '5',
  attributes: {
    name: 'Martin Fowler'
  }
};
book2.relationships = {
  author: {
    data: {
      type: 'authors',
      id: '5'
    }
  }
};
jsonBooks.included = [
  ...authors,
  authorBook2,
];

class Author extends Model {
  static type() {
    return 'authors';
  }

  static fields() {
    return [
      'name',
    ];
  }
}

class BookWithAuthor extends Model {
  static type() {
    return 'books';
  }

  static fields() {
    return [
      'title',
    ];
  }

  static relationships() {
    return {
      author: Author
    };
  }

  static computed() {
    return {
      authorCount(book) {
        if (Array.isArray(book.author)) {
          return book.author.length;
        }
        if (book.author) {
          return 1;
        }
        return 0;
      }
    };
  }
}

describe('Transformer - Deserialize with relationship', () => {
  test('It should create a relationship as array and computed value',
    () => {
      let transformer = new Transformer();
      let book = transformer.deserialize(BookWithAuthor, jsonBook);

      expect(book.author).toBeInstanceOf(Array);
      expect(book.title).toBe(
        'Design Patterns: Elements of Reusable Object-Oriented Software'
      );
      expect(book.author.length).toBe(4);
      expect(book.authorCount).toBe(4);
    });

  test('It should create a relationship as object and computed value',
    () => {
      let transformer = new Transformer();
      let books = transformer.deserialize(BookWithAuthor, jsonBooks);
      expect(books.length).toBe(2);
      expect(books[1]?.author?.name).toBe('Martin Fowler');
      expect(books[1]?.authorCount).toBe(1);
    });
});
