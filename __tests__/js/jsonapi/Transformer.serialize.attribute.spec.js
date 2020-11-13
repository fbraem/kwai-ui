import Transformer from '@/js/jsonapi/Transformer';
import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';

class Book extends Model {
  static type() {
    return 'books';
  }

  static fields() {
    return {
      title: new Attribute(),
      isbn: new Attribute() // To test an attribute that is not available
    };
  }

  static relationships() {
    return {
      author: Author
    };
  }
}

class Author extends Model {
  static fields() {
    return {
      name: new Attribute()
    };
  }

  static type() {
    return 'authors';
  }
}

describe('Transformer - Serialize with fields', () => {
  test('It should create a JSONAPI structure', () => {
    let book = new Book();
    book.title
      = 'Design Patterns: Elements of Reusable Object-Oriented Software';

    let transformer = new Transformer();
    let json = transformer.serialize(book);

    expect(json.data.type).toBe('books');
    expect(json.data.attributes.title).toBe(
      'Design Patterns: Elements of Reusable Object-Oriented Software'
    );
  });
});

describe('Transformer - Serialize with relationship', () => {
  test('It should create a JSONAPI structure with a relationship',
    () => {
      let book = new Book('1');
      book.title = 'Refactoring: Improving the Design of Existing Code';
      let author = new Author('1');
      author.name = 'Martin Fowler';
      book.author = author;

      let transformer = new Transformer();
      let json = transformer.serialize(book);

      expect(json?.data?.type).toBe('books');
      expect(json?.data?.id).toBe('1');
      expect(json?.data?.attributes?.title).toBe(
        'Refactoring: Improving the Design of Existing Code'
      );
      expect(json?.data?.relationships?.author?.data?.type)
        .toBe('authors');
      expect(json?.data?.relationships?.author?.data?.id).toBe('1');
    });
});

describe('Transformer - Serialize with relationships', () => {
  test('It should create a JSONAPI structure with a relationship array',
    () => {
      let book = new Book();
      book.title =
        'Design Patterns: Elements of Reusable Object-Oriented Software';
      const author1 = new Author('1');
      author1.name = 'Eric Gamma';
      const author2 = new Author('2');
      author1.name = 'Richard Helm';
      const author3 = new Author('3');
      author1.name = 'Ralph Johnson';
      const author4 = new Author('4');
      author1.name = 'John Vlissides';
      book.author = [
        author1, author2, author3, author4,
      ];

      let transformer = new Transformer();
      let json = transformer.serialize(book);

      expect(json.data.type).toBe('books');
      expect(json.data.attributes.title).toBe(
        'Design Patterns: Elements of Reusable Object-Oriented Software'
      );
      expect(json.data.relationships.author.data.length).toBe(4);
      expect(json.data.relationships.author.data[0].type).toBe('authors');
      expect(json.data.relationships.author.data[0].id).toBe('1');
    });
});
